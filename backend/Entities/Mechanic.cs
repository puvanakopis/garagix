using System.ComponentModel.DataAnnotations;

namespace Garagix.Api.Entities;

/// <summary>
/// Represents a master workshop technician or mechanic in the Garagix garage directory.
/// </summary>
public class Mechanic
{
    /// <summary>
    /// Gets or sets the unique primary key identifier (e.g. 'mech-1' or UUID string).
    /// </summary>
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Gets or sets the full legal and professional name of the master technician.
    /// </summary>
    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the professional job title (e.g. 'Tire &amp; Suspension Master').
    /// </summary>
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the primary engineering specialization or discipline.
    /// </summary>
    [Required]
    [MaxLength(200)]
    public string Specialization { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the years of professional automotive engineering experience.
    /// </summary>
    public int ExperienceYears { get; set; }

    /// <summary>
    /// Gets or sets the aggregate customer satisfaction rating (from 1.0 to 5.0).
    /// </summary>
    public decimal Rating { get; set; } = 5.0m;

    /// <summary>
    /// Gets or sets the total number of customer quality audits and verified reviews.
    /// </summary>
    public int ReviewCount { get; set; }

    /// <summary>
    /// Gets or sets the engineering biography and technical background.
    /// </summary>
    [MaxLength(1000)]
    public string Bio { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the profile avatar image URL or asset path.
    /// </summary>
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the live availability status ('available', 'busy', 'on_leave').
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "available";

    /// <summary>
    /// Gets or sets the direct contact telephone number.
    /// </summary>
    [MaxLength(30)]
    public string? Phone { get; set; }

    /// <summary>
    /// Gets or sets the direct workshop email address.
    /// </summary>
    [MaxLength(150)]
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the number of active bookings assigned to this technician.
    /// </summary>
    public int AssignedBookingsCount { get; set; }

    /// <summary>
    /// Gets or sets the factory and guild certifications earned by the technician.
    /// </summary>
    public List<string> Certifications { get; set; } = [];

    /// <summary>
    /// Gets or sets the weekly operational working shift hours.
    /// </summary>
    [MaxLength(100)]
    public string WorkingHours { get; set; } = "8:00 AM - 5:30 PM (Mon - Sat)";

    /// <summary>
    /// Gets or sets optional serialized social media profile links (LinkedIn, Twitter, Facebook).
    /// </summary>
    [MaxLength(1000)]
    public string? SocialsJson { get; set; }

    /// <summary>
    /// Gets or sets the timestamp when the technician profile was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the timestamp when the technician profile was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

