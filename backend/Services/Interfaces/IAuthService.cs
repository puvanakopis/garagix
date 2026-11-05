using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Defines business contracts for user authentication, OTP registration verification, password recovery, and profile access.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Step 1 of registration: Validates submitted customer details, checks email uniqueness,
    /// persists a pending registration record, and dispatches a 6-digit OTP code to the provided email.
    /// </summary>
    /// <param name="request">Registration payload containing user details and password.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns>A <see cref="RegistrationOtpResponse"/> indicating dispatch status and expiry window.</returns>
    Task<RegistrationOtpResponse> SendRegistrationOtpAsync(SendRegistrationOtpRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Step 2 of registration: Validates the 6-digit email OTP. If valid, provisions the permanent user account,
    /// removes pending records, dispatches a welcome email, and returns a signed JWT bearer session.
    /// </summary>
    /// <param name="request">Email and OTP verification payload.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns>An <see cref="AuthResponse"/> including the generated JWT token and active user profile.</returns>
    Task<AuthResponse> VerifyRegistrationOtpAsync(VerifyRegistrationOtpRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Unified registration endpoint: If an OTP is included, verifies it and creates the account.
    /// If no OTP is included, initiates the registration OTP process by dispatching an email code.
    /// </summary>
    /// <param name="request">Registration payload containing user credentials, profile details, and optional OTP.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns>An <see cref="AuthResponse"/> containing either the session token or indicating OTP requirement.</returns>
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates user credentials and issues a signed JWT token upon success.
    /// </summary>
    /// <param name="request">Login payload with email, password, and remember-me preference.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns>An <see cref="AuthResponse"/> containing the authenticated session token and profile.</returns>
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Initiates password recovery by validating the user's email address and sending a 6-digit OTP code.
    /// </summary>
    /// <param name="request">Forgot password payload containing the target email address.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns>A <see cref="ForgotPasswordResponse"/> indicating status and expiry time.</returns>
    Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Validates whether a provided 6-digit OTP code matches the active password recovery code and has not expired.
    /// </summary>
    /// <param name="request">OTP verification payload with user email and entered OTP code.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns><c>true</c> if the OTP is valid; otherwise throws a <see cref="BadHttpRequestException"/>.</returns>
    Task<bool> VerifyOtpAsync(VerifyOtpRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Completes the password recovery cycle by resetting the password after OTP validation.
    /// </summary>
    /// <param name="request">Reset payload including email, OTP code, and the new password.</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns><c>true</c> if password reset successfully.</returns>
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves user profile details for a given authenticated user ID.
    /// </summary>
    /// <param name="userId">The unique identifier of the user (from JWT subject).</param>
    /// <param name="cancellationToken">Cancellation token for aborting the operation.</param>
    /// <returns>The <see cref="UserResponse"/> profile object, or <c>null</c> if not found.</returns>
    Task<UserResponse?> GetCurrentUserAsync(string userId, CancellationToken cancellationToken = default);
}
