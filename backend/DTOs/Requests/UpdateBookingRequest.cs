using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for modifying an existing repair booking.
/// </summary>
public class UpdateBookingRequest
{
    /// <summary>
    /// Gets or sets scheduled appointment date (YYYY-MM-DD).
    /// </summary>
    public string? AppointmentDate { get; set; }

    /// <summary>
    /// Gets or sets scheduled appointment time.
    /// </summary>
    public string? AppointmentTime { get; set; }

    /// <summary>
    /// Gets or sets estimated repair cost.
    /// </summary>
    public decimal? EstimatedPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets final settled repair cost.
    /// </summary>
    public decimal? FinalPriceLkr { get; set; }

    /// <summary>
    /// Gets or sets payment settlement status.
    /// </summary>
    public string? PaymentStatus { get; set; }

    /// <summary>
    /// Gets or sets vehicle details snapshot.
    /// </summary>
    public BookingVehicleDto? Vehicle { get; set; }

    /// <summary>
    /// Gets or sets vehicle intake drop-off option.
    /// </summary>
    public string? DropOffOption { get; set; }

    /// <summary>
    /// Gets or sets customer phone contact.
    /// </summary>
    public string? CustomerPhone { get; set; }

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string? CustomerEmail { get; set; }

    /// <summary>
    /// Gets or sets problem description.
    /// </summary>
    public string? ProblemDescription { get; set; }

    /// <summary>
    /// Gets or sets internal garage mechanic notes.
    /// </summary>
    public string? InternalNotes { get; set; }

    /// <summary>
    /// Gets or sets repair status.
    /// </summary>
    public string? Status { get; set; }

    /// <summary>
    /// Gets or sets progress percent.
    /// </summary>
    public int? ProgressPercent { get; set; }

    /// <summary>
    /// Gets or sets assigned technician ID.
    /// </summary>
    public string? AssignedMechanicId { get; set; }

    /// <summary>
    /// Gets or sets assigned technician name.
    /// </summary>
    public string? AssignedMechanicName { get; set; }
}
