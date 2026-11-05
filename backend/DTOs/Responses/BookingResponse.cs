namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object representing a booked workshop appointment, vehicle telemetry, and lifecycle status.
/// </summary>
public class BookingResponse
{
    /// <summary>
    /// Gets or sets primary booking identifier.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets tracking reference code (e.g., 'GRX-2026-8941').
    /// </summary>
    public string ReferenceNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer user identifier.
    /// </summary>
    public string CustomerId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer full name.
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer telephone number.
    /// </summary>
    public string CustomerPhone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string CustomerEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle specifications.
    /// </summary>
    public BookingVehicleDto Vehicle { get; set; } = new();

    /// <summary>
    /// Gets or sets list of service package identifiers.
    /// </summary>
    public IReadOnlyList<string> ServiceIds { get; set; } = [];

    /// <summary>
    /// Gets or sets list of service package display titles.
    /// </summary>
    public IReadOnlyList<string> ServiceNames { get; set; } = [];

    /// <summary>
    /// Gets or sets problem summary.
    /// </summary>
    public string ProblemDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets list of reported vehicle symptoms.
    /// </summary>
    public IReadOnlyList<string> Symptoms { get; set; } = [];

    /// <summary>
    /// Gets or sets list of uploaded damage inspection images.
    /// </summary>
    public IReadOnlyList<string> DamageImages { get; set; } = [];

    /// <summary>
    /// Gets or sets assigned technician identifier.
    /// </summary>
    public string? AssignedMechanicId { get; set; }

    /// <summary>
    /// Gets or sets assigned technician display name.
    /// </summary>
    public string? AssignedMechanicName { get; set; }

    /// <summary>
    /// Gets or sets appointment date (YYYY-MM-DD).
    /// </summary>
    public string AppointmentDate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets appointment time slot.
    /// </summary>
    public string AppointmentTime { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets estimated repair price in LKR.
    /// </summary>
    public decimal EstimatedPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets final settled price in LKR.
    /// </summary>
    public decimal? FinalPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets repair status (PENDING, CONFIRMED, IN_PROGRESS, etc.).
    /// </summary>
    public string Status { get; set; } = "PENDING";

    /// <summary>
    /// Gets or sets completion percentage (0 - 100).
    /// </summary>
    public int ProgressPercent { get; set; }

    /// <summary>
    /// Gets or sets estimated completion time description.
    /// </summary>
    public string EstimatedCompletion { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer intake drop-off preference ('drop_off' or 'wait_at_lounge').
    /// </summary>
    public string DropOffOption { get; set; } = "drop_off";

    /// <summary>
    /// Gets or sets internal workshop comments.
    /// </summary>
    public string? InternalNotes { get; set; }

    /// <summary>
    /// Gets or sets billing status ('pending', 'partially_paid', 'paid', 'refunded').
    /// </summary>
    public string PaymentStatus { get; set; } = "pending";

    /// <summary>
    /// Gets or sets creation timestamp string.
    /// </summary>
    public string CreatedAt { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets last update timestamp.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Vehicle snapshot data transfer object for a repair booking.
/// </summary>
public class BookingVehicleDto
{
    /// <summary>
    /// Gets or sets license plate number.
    /// </summary>
    public string PlateNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets manufacturer brand name.
    /// </summary>
    public string Brand { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle model.
    /// </summary>
    public string Model { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets model year.
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// Gets or sets odometer mileage in kilometers.
    /// </summary>
    public int? MileageKm { get; set; }
}
