using Microsoft.EntityFrameworkCore;
using Garagix.Api.Common.Utilities;
using Garagix.Api.Data;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;
    private readonly IWebHostEnvironment _environment;

    public AuthService(
        ApplicationDbContext dbContext,
        ITokenService tokenService,
        IEmailService emailService,
        ILogger<AuthService> logger,
        IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _tokenService = tokenService;
        _emailService = emailService;
        _logger = logger;
        _environment = environment;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _dbContext.Users
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (existingUser)
        {
            throw new BadHttpRequestException($"An account with email '{request.Email}' already exists.");
        }

        var user = new User
        {
            Id = "cust-" + Random.Shared.Next(100, 999),
            Name = request.FullName.Trim(),
            Email = normalizedEmail,
            Phone = request.Phone.Trim(),
            Address = request.Address?.Trim(),
            Role = string.IsNullOrWhiteSpace(request.Role) ? "customer" : request.Role.ToLowerInvariant(),
            Status = "active",
            TotalBookings = 0,
            PasswordHash = PasswordHelper.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        // Send welcome email asynchronously
        var welcomeEmailHtml = EmailTemplateHelper.GetWelcomeEmailTemplate(user.Name);
        _ = _emailService.SendEmailAsync(user.Email, "Welcome to Garagix Workshop Portal", welcomeEmailHtml, cancellationToken);

        var (token, expiresAt) = _tokenService.GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = $"Account registered successfully. Welcome, {user.Name}!",
            Token = token,
            ExpiresAt = expiresAt,
            User = MapToUserResponse(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null || !PasswordHelper.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email address or password.");
        }

        if (user.Status.Equals("inactive", StringComparison.OrdinalIgnoreCase))
        {
            throw new UnauthorizedAccessException("Your account is currently inactive. Please contact workshop administration.");
        }

        var (token, expiresAt) = _tokenService.GenerateToken(user, request.RememberMe);

        return new AuthResponse
        {
            Success = true,
            Message = $"Welcome back, {user.Name}!",
            Token = token,
            ExpiresAt = expiresAt,
            User = MapToUserResponse(user)
        };
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
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

    public async Task<bool> VerifyOtpAsync(VerifyOtpRequest request, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            throw new BadHttpRequestException("User account not found.");
        }

        if (string.IsNullOrEmpty(user.PasswordResetOtp) || user.PasswordResetOtp != request.Otp.Trim())
        {
            throw new BadHttpRequestException("Invalid verification code. Please check and try again.");
        }

        if (user.PasswordResetOtpExpiry == null || user.PasswordResetOtpExpiry < DateTime.UtcNow)
        {
            throw new BadHttpRequestException("Verification code has expired. Please request a new OTP.");
        }

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
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
        return true;
    }

    public async Task<UserResponse?> GetCurrentUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        return user == null ? null : MapToUserResponse(user);
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
