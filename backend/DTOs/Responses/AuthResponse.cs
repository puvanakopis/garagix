namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer response object returned following authentication and registration attempts.
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// Indicates whether authentication or registration succeeded.
    /// </summary>
    public bool Success { get; set; } = true;

    /// <summary>
    /// User-facing descriptive message regarding the authentication result.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Signed JWT bearer token issued for subsequent authorized API requests.
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// UTC timestamp indicating when the JWT session token expires.
    /// </summary>
    public DateTime? ExpiresAt { get; set; }

    /// <summary>
    /// The authenticated user's profile details.
    /// </summary>
    public UserResponse? User { get; set; }

    /// <summary>
    /// Flag indicating if an email OTP verification is required before full account activation.
    /// </summary>
    public bool RequiresOtp { get; set; } = false;

    /// <summary>
    /// One-time password verification code, supplied in development environments for testing ease.
    /// </summary>
    public string? Otp { get; set; }
}
