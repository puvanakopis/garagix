namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Response returned upon requesting a registration verification OTP code.
/// </summary>
public class RegistrationOtpResponse
{
    /// <summary>
    /// Indicates whether the OTP dispatch request was successful.
    /// </summary>
    public bool Success { get; set; } = true;

    /// <summary>
    /// Informational message regarding the dispatch.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// The recipient email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Validity window of the OTP in minutes.
    /// </summary>
    public int ExpiresInMinutes { get; set; } = 15;

    /// <summary>
    /// The generated OTP code, surfaced only in development mode for developer testing ease.
    /// </summary>
    public string? Otp { get; set; }
}

