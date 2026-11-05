using System.ComponentModel.DataAnnotations;

namespace Garagix.Api.Entities;

/// <summary>
/// Represents a customer vehicle registered in the Garagix garage management system.
/// </summary>
public class Vehicle
{
    /// <summary>
    /// Gets or sets the unique primary key identifier (e.g. 'veh-1' or UUID string).
    /// </summary>
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Gets or sets the foreign key identifier of the owning customer user.
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string CustomerId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the registered vehicle license plate number (e.g. 'WP CAD-4821').
    /// </summary>
    [Required]
    [MaxLength(30)]
    public string PlateNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the vehicle make or manufacturer (e.g. 'Toyota', 'Honda').
    /// </summary>
    [Required]
    [MaxLength(60)]
    public string Brand { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the vehicle model name (e.g. 'Prius Hybrid', 'Vezel RS').
    /// </summary>
    [Required]
    [MaxLength(80)]
    public string Model { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the manufacture model year.
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// Gets or sets the vehicle body or powertrain type (e.g. 'Hybrid', 'Sedan', 'SUV').
    /// </summary>
    [Required]
    [MaxLength(40)]
    public string Type { get; set; } = "Sedan";

    /// <summary>
    /// Gets or sets current recorded vehicle odometer mileage in kilometers.
    /// </summary>
    public int? MileageKm { get; set; }

    /// <summary>
    /// Gets or sets the 17-character vehicle identification number (VIN).
    /// </summary>
    [MaxLength(50)]
    public string? Vin { get; set; }

    /// <summary>
    /// Gets or sets the exterior body paint color.
    /// </summary>
    [MaxLength(50)]
    public string? Color { get; set; }

    /// <summary>
    /// Gets or sets the timestamp when this vehicle record was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the timestamp when this vehicle record was last modified.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

