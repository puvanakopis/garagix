using Microsoft.EntityFrameworkCore;
using Garagix.Api.Common.Utilities;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Service implementing user authentication, OTP-verified account registration, password recovery, and profile lookup.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="AuthService"/> class using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dbContext">Database context for user entities.</param>
/// <param name="tokenService">JWT token generation service.</param>
/// <param name="emailService">Transactional email service for OTP and welcome emails.</param>
/// <param name="logger">Structured logger instance.</param>
/// <param name="environment">Hosting environment for environment-specific behaviors.</param>
public class AuthService(
    ApplicationDbContext dbContext,
    ITokenService tokenService,
    IEmailService emailService,
    ILogger<AuthService> logger,
    IWebHostEnvironment environment) : IAuthService
{
    private readonly ApplicationDbContext _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    private readonly ITokenService _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
    private readonly IEmailService _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
    private readonly ILogger<AuthService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    private readonly IWebHostEnvironment _environment = environment ?? throw new ArgumentNullException(nameof(environment));

    /// <inheritdoc />
    public async Task<RegistrationOtpResponse> SendRegistrationOtpAsync(SendRegistrationOtpRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // 1. Check if email already belongs to an active user
        var existingUser = await _dbContext.Users
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (existingUser)
        {
            _logger.LogWarning("Registration OTP attempt rejected: email '{Email}' already exists in Users", request.Email);
            throw new BadHttpRequestException($"An account with email '{request.Email}' already exists. Please sign in instead.");
        }

        // 2. Validate passwords match
        if (request.Password != request.ConfirmPassword)
        {
            throw new BadHttpRequestException("Passwords do not match.");
        }

        if (request.Password.Length < 6)
        {
            throw new BadHttpRequestException("Password must be at least 6 characters.");
        }

        // 3. Generate 6-digit numeric OTP and hash password
        var otpCode = Random.Shared.Next(100000, 999999).ToString();
        var passwordHash = PasswordHelper.HashPassword(request.Password);

        // 4. Upsert pending registration record
        var existingPending = await _dbContext.PendingRegistrations
            .FirstOrDefaultAsync(p => p.Email.ToLower() == normalizedEmail, cancellationToken);

        if (existingPending != null)
        {
            existingPending.FullName = request.FullName.Trim();
            existingPending.Phone = request.Phone.Trim();
            existingPending.Address = request.Address?.Trim();
            existingPending.Role = string.IsNullOrWhiteSpace(request.Role) ? "customer" : request.Role.ToLowerInvariant();
            existingPending.PasswordHash = passwordHash;
            existingPending.Otp = otpCode;
            existingPending.OtpExpiry = DateTime.UtcNow.AddMinutes(15);
            existingPending.CreatedAt = DateTime.UtcNow;
        }
        else
        {
            var pending = new PendingRegistration
            {
                Id = Guid.NewGuid().ToString(),
                FullName = request.FullName.Trim(),
                Email = normalizedEmail,
                Phone = request.Phone.Trim(),
                Address = request.Address?.Trim(),
                Role = string.IsNullOrWhiteSpace(request.Role) ? "customer" : request.Role.ToLowerInvariant(),
                PasswordHash = passwordHash,
                Otp = otpCode,
                OtpExpiry = DateTime.UtcNow.AddMinutes(15),
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.PendingRegistrations.Add(pending);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Registration verification OTP generated for {Email}", normalizedEmail);

        // 5. Send OTP email using Garagix branded template
        var emailHtml = EmailTemplateHelper.GetRegistrationOtpTemplate(request.FullName.Trim(), otpCode, 15);
        await _emailService.SendEmailAsync(normalizedEmail, "Garagix Account Registration Verification Code", emailHtml, cancellationToken);

        return new RegistrationOtpResponse
        {
            Success = true,
            Message = $"A 6-digit verification code has been dispatched to {request.Email}. Please enter the code to complete registration.",
            Email = normalizedEmail,
            ExpiresInMinutes = 15,
            Otp = _environment.IsDevelopment() ? otpCode : null
        };
    }

    /// <inheritdoc />
    public async Task<AuthResponse> VerifyRegistrationOtpAsync(VerifyRegistrationOtpRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // 1. Verify user doesn't already exist
        var existingUser = await _dbContext.Users
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (existingUser)
        {
            throw new BadHttpRequestException($"An account with email '{request.Email}' already exists. Please sign in instead.");
        }

        // 2. Locate pending registration record
        var pending = await _dbContext.PendingRegistrations
            .FirstOrDefaultAsync(p => p.Email.ToLower() == normalizedEmail, cancellationToken);

        if (pending == null)
        {
            throw new BadHttpRequestException("No pending registration found for this email address. Please initiate the registration process first.");
        }

        // 3. Verify OTP matching
        if (string.IsNullOrEmpty(pending.Otp) || pending.Otp != request.Otp.Trim())
        {
            _logger.LogWarning("Invalid registration OTP code entered for email: {Email}", request.Email);
            throw new BadHttpRequestException("Invalid verification code. Please check your email and try again.");
        }

        // 4. Verify OTP expiration
        if (pending.OtpExpiry < DateTime.UtcNow)
        {
            _logger.LogWarning("Expired registration OTP code entered for email: {Email}", request.Email);
            throw new BadHttpRequestException("The verification code has expired. Please request a new registration code.");
        }

        // 5. OTP is correct! Strictly now create the permanent account in Users table
        var user = new User
        {
            Id = "cust-" + Random.Shared.Next(100, 999),
            Name = pending.FullName,
            Email = pending.Email,
            Phone = pending.Phone,
            Address = pending.Address,
            Role = pending.Role,
            Status = "active",
            TotalBookings = 0,
            PasswordHash = pending.PasswordHash,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        _dbContext.PendingRegistrations.Remove(pending);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("New customer account created successfully following OTP verification: {UserId} ({Email})", user.Id, user.Email);

        // 6. Send welcome email asynchronously
        var welcomeEmailHtml = EmailTemplateHelper.GetWelcomeEmailTemplate(user.Name);
        _ = _emailService.SendEmailAsync(user.Email, "Welcome to Garagix Workshop Portal", welcomeEmailHtml, cancellationToken);

        // 7. Generate JWT token
        var (token, expiresAt) = _tokenService.GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = $"Account registered and verified successfully. Welcome, {user.Name}!",
            Token = token,
            ExpiresAt = expiresAt,
            User = MapToUserResponse(user),
            RequiresOtp = false
        };
    }

    /// <inheritdoc />
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        // If an OTP was provided, complete registration via verification
        if (!string.IsNullOrWhiteSpace(request.Otp))
        {
            return await VerifyRegistrationOtpAsync(new VerifyRegistrationOtpRequest
            {
                Email = request.Email,
                Otp = request.Otp
            }, cancellationToken);
        }

        // If no OTP was provided, dispatch the OTP email and inform the client that OTP is required
        var otpResponse = await SendRegistrationOtpAsync(new SendRegistrationOtpRequest
        {
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            Password = request.Password,
            ConfirmPassword = request.ConfirmPassword,
            Role = request.Role
        }, cancellationToken);

        return new AuthResponse
        {
            Success = false,
            Message = otpResponse.Message,
            RequiresOtp = true,
            Otp = otpResponse.Otp
        };
    }

    /// <inheritdoc />
    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null || !PasswordHelper.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for email: {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid email address or password.");
        }

        if (user.Status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Inactive user login attempt for email: {Email}", request.Email);
            throw new UnauthorizedAccessException("Your account is currently inactive. Please contact workshop administration.");
        }

        var (token, expiresAt) = _tokenService.GenerateToken(user, request.RememberMe);

        _logger.LogInformation("User signed in successfully: {UserId} ({Email})", user.Id, user.Email);

        return new AuthResponse
        {
            Success = true,
            Message = $"Welcome back, {user.Name}!",
            Token = token,
            ExpiresAt = expiresAt,
            User = MapToUserResponse(user)
        };
    }

    /// <inheritdoc />
    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            if (_environment.IsDevelopment())
            {
                throw new BadHttpRequestException($"No account registered with email '{request.Email}'.");
            }

            return new ForgotPasswordResponse
            {
                Success = true,
                Message = "If an account exists with this email, an OTP code has been dispatched."
            };
        }

        // Generate 6-digit numeric OTP
        var otpCode = Random.Shared.Next(100000, 999999).ToString();
        user.PasswordResetOtp = otpCode;
        user.PasswordResetOtpExpiry = DateTime.UtcNow.AddMinutes(15);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password reset OTP generated for {Email}", user.Email);

        // Send OTP email
        var emailHtml = EmailTemplateHelper.GetPasswordResetOtpTemplate(user.Name, otpCode, 15);
        await _emailService.SendEmailAsync(user.Email, "Garagix Password Reset Verification Code", emailHtml, cancellationToken);

        return new ForgotPasswordResponse
        {
            Success = true,
            Message = $"Verification code sent to {user.Email}.",
            Otp = _environment.IsDevelopment() ? otpCode : null,
            ExpiresInMinutes = 15
        };
    }

    /// <inheritdoc />
    public async Task<bool> VerifyOtpAsync(VerifyOtpRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            throw new BadHttpRequestException("User account not found.");
        }

        if (string.IsNullOrEmpty(user.PasswordResetOtp) || user.PasswordResetOtp != request.Otp.Trim())
        {
            _logger.LogWarning("Invalid OTP entered for {Email}", request.Email);
            throw new BadHttpRequestException("Invalid verification code. Please check and try again.");
        }

        if (user.PasswordResetOtpExpiry == null || user.PasswordResetOtpExpiry < DateTime.UtcNow)
        {
            _logger.LogWarning("Expired OTP entered for {Email}", request.Email);
            throw new BadHttpRequestException("Verification code has expired. Please request a new OTP.");
        }

        return true;
    }

    /// <inheritdoc />
    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            throw new BadHttpRequestException("User account not found.");
        }

        if (string.IsNullOrEmpty(user.PasswordResetOtp) || user.PasswordResetOtp != request.Otp.Trim())
        {
            throw new BadHttpRequestException("Invalid verification code.");
        }

        if (user.PasswordResetOtpExpiry == null || user.PasswordResetOtpExpiry < DateTime.UtcNow)
        {
            throw new BadHttpRequestException("Verification code has expired. Please generate a new code.");
        }

        user.PasswordHash = PasswordHelper.HashPassword(request.NewPassword);
        user.PasswordResetOtp = null;
        user.PasswordResetOtpExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password reset completed successfully for {Email}", user.Email);
        return true;
    }

    /// <inheritdoc />
    public async Task<UserResponse?> GetCurrentUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) return null;

        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        return user == null ? null : MapToUserResponse(user);
    }

    /// <inheritdoc />
    public async Task<UserResponse?> UpdateProfileAsync(string userId, UpdateProfileRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) return null;
        ArgumentNullException.ThrowIfNull(request);

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null) return null;

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            user.Name = request.Name.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Phone))
        {
            user.Phone = request.Phone.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Address))
        {
            user.Address = request.Address.Trim();
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Profile updated successfully for user ID '{UserId}'.", userId);

        return MapToUserResponse(user);
    }

    /// <inheritdoc />
    public async Task<(bool Success, string Message)> ChangePasswordAsync(string userId, ChangePasswordRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(userId)) return (false, "User identifier is required.");
        ArgumentNullException.ThrowIfNull(request);

        if (string.IsNullOrWhiteSpace(request.CurrentPassword))
        {
            return (false, "Current password is required.");
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
        {
            return (false, "New password must be at least 6 characters in length.");
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return (false, "New password and confirmation password do not match.");
        }

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null)
        {
            return (false, "User account not found.");
        }

        if (!PasswordHelper.VerifyPassword(request.CurrentPassword, user.PasswordHash))
        {
            return (false, "The current password provided is incorrect.");
        }

        user.PasswordHash = PasswordHelper.HashPassword(request.NewPassword);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Password successfully updated for user ID '{UserId}'.", userId);
        return (true, "Password has been successfully updated.");
    }

    private static UserResponse MapToUserResponse(User user)
    {
        return new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            TotalBookings = user.TotalBookings,
            Status = user.Status
        };
    }
}
