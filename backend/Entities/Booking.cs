namespace Garagix.Api.Entities;

/// <summary>
/// Represents a vehicle repair or maintenance service appointment and workshop repair lifecycle.
/// </summary>
public class Booking
{
    /// <summary>
    /// Gets or sets the primary booking identifier (e.g., 'book-1' or GUID).
    /// </summary>
    public string Id { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// Gets or sets the unique customer tracking reference number (e.g., 'GRX-2026-8941').
    /// </summary>
    public string ReferenceNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the associated customer user identifier.
    /// </summary>
    public string CustomerId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the customer contact full name.
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the customer contact phone number.
    /// </summary>
    public string CustomerPhone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the customer email address.
    /// </summary>
    public string CustomerEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the vehicle license plate number (e.g. 'WP CAD-4821').
    /// </summary>
    public string VehiclePlateNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the vehicle manufacturer brand.
    /// </summary>
    public string VehicleBrand { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the vehicle model designation.
    /// </summary>
    public string VehicleModel { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the vehicle manufacturing year.
    /// </summary>
    public int VehicleYear { get; set; }

    /// <summary>
    /// Gets or sets the vehicle odometer mileage at intake in kilometers.
    /// </summary>
    public int? VehicleMileageKm { get; set; }

    /// <summary>
    /// Gets or sets the JSON-serialized list of selected service package identifiers.
    /// </summary>
    public string ServiceIds { get; set; } = "[]";

    /// <summary>
    /// Gets or sets the JSON-serialized list of selected service package display names.
    /// </summary>
    public string ServiceNames { get; set; } = "[]";

    /// <summary>
    /// Gets or sets customer problem description and intake symptoms.
    /// </summary>
    public string ProblemDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the JSON-serialized list of specific symptoms reported.
    /// </summary>
    public string? Symptoms { get; set; }

    /// <summary>
    /// Gets or sets the JSON-serialized list of damage inspection image URLs.
    /// </summary>
    public string? DamageImages { get; set; }

    /// <summary>
    /// Gets or sets the assigned technician identifier.
    /// </summary>
    public string? AssignedMechanicId { get; set; }

    /// <summary>
    /// Gets or sets the assigned technician display name.
    /// </summary>
    public string? AssignedMechanicName { get; set; }

    /// <summary>
    /// Gets or sets scheduled appointment date in ISO format (YYYY-MM-DD).
    /// </summary>
    public string AppointmentDate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets scheduled appointment time slot (e.g. '09:30 AM').
    /// </summary>
    public string AppointmentTime { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets initial estimated repair quote in Sri Lankan Rupees.
    /// </summary>
    public decimal EstimatedPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets final invoice settled amount in Sri Lankan Rupees.
    /// </summary>
    public decimal? FinalPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets current repair lifecycle status (PENDING, CONFIRMED, IN_PROGRESS, etc.).
    /// </summary>
    public string Status { get; set; } = "PENDING";

    /// <summary>
    /// Gets or sets numeric job progress percentage (0 to 100).
    /// </summary>
    public int ProgressPercent { get; set; } = 10;

    /// <summary>
    /// Gets or sets expected vehicle readiness date and time string.
    /// </summary>
    public string EstimatedCompletion { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle handover choice ('drop_off' or 'wait_at_lounge').
    /// </summary>
    public string DropOffOption { get; set; } = "drop_off";

    /// <summary>
    /// Gets or sets internal garage mechanic diagnosis notes and parts comments.
    /// </summary>
    public string? InternalNotes { get; set; }

    /// <summary>
    /// Gets or sets billing payment settlement status ('pending', 'partially_paid', 'paid', 'refunded').
    /// </summary>
    public string PaymentStatus { get; set; } = "pending";

    /// <summary>
    /// Gets or sets the timestamp when booking was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets timestamp when booking was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
