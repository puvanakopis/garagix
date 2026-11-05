namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object used for customer account registration.
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// Full customer name.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// User email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// User phone contact number.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Optional postal or residential address.
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// Password credentials.
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Confirmation password matching <see cref="Password"/>.
    /// </summary>
    public string ConfirmPassword { get; set; } = string.Empty;

    /// <summary>
    /// Assigned role (default "customer").
    /// </summary>
    public string Role { get; set; } = "customer";

    /// <summary>
    /// Optional 6-digit OTP verification code sent to the email address.
    /// If omitted, system initiates OTP generation and emails the code before account activation.
    /// </summary>
    public string? Otp { get; set; }
}
