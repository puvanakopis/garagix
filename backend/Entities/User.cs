using System.ComponentModel.DataAnnotations;

namespace Garagix.Api.Entities;

public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Address { get; set; }

    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "customer"; // "customer" | "admin" 

    public int TotalBookings { get; set; } = 0;

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "active"; // "active" | "inactive"

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(10)]
    public string? PasswordResetOtp { get; set; }

    public DateTime? PasswordResetOtpExpiry { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}

