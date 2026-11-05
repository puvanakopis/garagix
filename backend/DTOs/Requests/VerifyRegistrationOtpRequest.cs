namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object used to verify the registration OTP code and complete account activation.
/// </summary>
public class VerifyRegistrationOtpRequest
{
    /// <summary>
    /// Email address of the pending registration.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// The 6-digit verification code received by email.
    /// </summary>
    public string Otp { get; set; } = string.Empty;
}

