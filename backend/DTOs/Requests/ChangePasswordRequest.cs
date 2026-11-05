namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for updating account security password.
/// </summary>
public class ChangePasswordRequest
{
    /// <summary>
    /// Gets or sets current active password for verification.
    /// </summary>
    public string CurrentPassword { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets new desired password.
    /// </summary>
    public string NewPassword { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets confirmation of the new password.
    /// </summary>
    public string ConfirmPassword { get; set; } = string.Empty;
}

