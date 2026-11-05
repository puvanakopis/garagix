namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object used to initiate customer registration by submitting contact credentials
/// and dispatching a 6-digit email verification one-time password (OTP).
/// </summary>
public class SendRegistrationOtpRequest
{
    /// <summary>
    /// Full customer name.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Email address to register and receive the verification code.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Customer phone contact number.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Optional street or postal address.
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// User account password.
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Confirmation password matching <see cref="Password"/>.
    /// </summary>
    public string ConfirmPassword { get; set; } = string.Empty;

    /// <summary>
    /// User role within the system (default: customer).
    /// </summary>
    public string Role { get; set; } = "customer";
}

