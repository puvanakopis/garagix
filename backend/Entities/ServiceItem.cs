using System.ComponentModel.DataAnnotations;

namespace Garagix.Api.Entities;

/// <summary>
/// Represents a vehicle repair or maintenance service offered in the Garagix Service Catalog.
/// </summary>
public class ServiceItem
{
    /// <summary>
    /// Gets or sets the unique primary key identifier (e.g. 'srv-1' or UUID string).
    /// </summary>
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Gets or sets the customer-facing title of the service package.
    /// </summary>
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the URL-friendly unique slug identifier for public routing.
    /// </summary>
    [Required]
    [MaxLength(150)]
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the primary category classification (e.g. 'Maintenance', 'Diagnostics').
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the concise overview description displayed on card summaries.
    /// </summary>
    [Required]
    [MaxLength(500)]
    public string ShortDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the comprehensive in-depth explanation of service procedures and standards.
    /// </summary>
    [Required]
    public string FullDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the starting price in Sri Lankan Rupees (LKR).
    /// </summary>
    public decimal StartingPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets the estimated completion duration in minutes.
    /// </summary>
    public int DurationMinutes { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this package is spotlighted on the home landing page.
    /// </summary>
    public bool Featured { get; set; } = false;

    /// <summary>
    /// Gets or sets a value indicating whether this package is active and available for booking.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Gets or sets the list of checklist procedures and components included in this service package.
    /// Stored as a serialized JSON collection in MySQL.
    /// </summary>
    public List<string> IncludedItems { get; set; } = [];

    /// <summary>
    /// Gets or sets common vehicle warning signs or symptoms that prompt booking this service.
    /// Stored as a serialized JSON collection in MySQL.
    /// </summary>
    public List<string> CommonSymptoms { get; set; } = [];

    /// <summary>
    /// Gets or sets the identifiers of workshop mechanics specialized in this repair category.
    /// Stored as a serialized JSON collection in MySQL.
    /// </summary>
    public List<string> RecommendedMechanicIds { get; set; } = [];

    /// <summary>
    /// Gets or sets the timestamp when the service record was registered.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the timestamp when the service details were last modified.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

