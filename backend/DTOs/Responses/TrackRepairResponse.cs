namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object representing real-time vehicle repair telemetry, workshop bay diagnostics, and lifecycle milestone stages.
/// </summary>
public class TrackRepairResponse
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
    /// Gets or sets repair status code.
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets progress completion percentage (0 - 100).
    /// </summary>
    public int ProgressPercent { get; set; }

    /// <summary>
    /// Gets or sets human-readable estimated delivery or handover text.
    /// </summary>
    public string EstimatedCompletion { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets estimated repair cost in LKR.
    /// </summary>
    public decimal EstimatedPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets final invoice total if completed.
    /// </summary>
    public decimal? FinalPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets payment settlement status ('pending', 'partially_paid', 'paid').
    /// </summary>
    public string PaymentStatus { get; set; } = "pending";

    /// <summary>
    /// Gets or sets vehicle specifications.
    /// </summary>
    public BookingVehicleDto Vehicle { get; set; } = new();

    /// <summary>
    /// Gets or sets list of service package display titles.
    /// </summary>
    public IReadOnlyList<string> ServiceNames { get; set; } = [];

    /// <summary>
    /// Gets or sets reported problem summary.
    /// </summary>
    public string ProblemDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets assigned master technician name.
    /// </summary>
    public string AssignedMechanicName { get; set; } = "To Be Assigned";

    /// <summary>
    /// Gets or sets internal workshop bay technician log notes.
    /// </summary>
    public string? InternalNotes { get; set; }

    /// <summary>
    /// Gets or sets intake drop-off choice.
    /// </summary>
    public string DropOffOption { get; set; } = "drop_off";

    /// <summary>
    /// Gets or sets appointment booking date.
    /// </summary>
    public string AppointmentDate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets appointment booking time.
    /// </summary>
    public string AppointmentTime { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets chronological repair timeline milestone steps.
    /// </summary>
    public IReadOnlyList<TrackTimelineStepDto> Timeline { get; set; } = [];

    /// <summary>
    /// Gets or sets booking creation timestamp.
    /// </summary>
    public string CreatedAt { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets last updated ISO timestamp.
    /// </summary>
    public string? UpdatedAt { get; set; }
}

/// <summary>
/// Data transfer object representing an individual milestone stage in vehicle repair lifecycle.
/// </summary>
public class TrackTimelineStepDto
{
    /// <summary>
    /// Gets or sets 1-based sequential step order.
    /// </summary>
    public int Step { get; set; }

    /// <summary>
    /// Gets or sets status stage key.
    /// </summary>
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets stage display title.
    /// </summary>
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets stage description.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets optional stage completion timestamp.
    /// </summary>
    public string? Timestamp { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this stage has been completed.
    /// </summary>
    public bool Completed { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this is the currently active workshop stage.
    /// </summary>
    public bool Current { get; set; }
}

/// <summary>
/// Summary DTO for active repair selector dropdowns and feeds.
/// </summary>
public class TrackFeedSummaryDto
{
    /// <summary>
    /// Gets or sets booking identifier.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets tracking reference code.
    /// </summary>
    public string ReferenceNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle brand and model.
    /// </summary>
    public string VehicleModel { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle license plate.
    /// </summary>
    public string VehiclePlate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets current status.
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets completion percentage.
    /// </summary>
    public int ProgressPercent { get; set; }
}
