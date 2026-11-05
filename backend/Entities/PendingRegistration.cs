using System.ComponentModel.DataAnnotations;

namespace Garagix.Api.Entities;

/// <summary>
/// Represents a temporary registration record awaiting email OTP verification.
/// Account credentials and profile details are promoted to the permanent <see cref="User"/> table
/// strictly after the one-time password code is confirmed.
/// </summary>
public class PendingRegistration
{
    /// <summary>
    /// Unique identifier for the pending registration record.
    /// </summary>
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Full legal name of the registering customer.
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Contact email address awaiting verification.
    /// </summary>
    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contact phone number.
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Optional physical residential address.
    /// </summary>
    [MaxLength(250)]
    public string? Address { get; set; }

    /// <summary>
    /// Securely hashed password.
    /// </summary>
    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Assigned application role (defaults to "customer").
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "customer";

    /// <summary>
    /// The 6-digit numeric one-time password sent to the email.
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string Otp { get; set; } = string.Empty;

    /// <summary>
    /// Timestamp after which the OTP code is no longer valid.
    /// </summary>
    public DateTime OtpExpiry { get; set; }

    /// <summary>
    /// Timestamp when this pending registration was initialized.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

