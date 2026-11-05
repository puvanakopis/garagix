using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for initiating a new vehicle repair booking.
/// </summary>
public class CreateBookingRequest
{
    /// <summary>
    /// Gets or sets customer user identifier if authenticated.
    /// </summary>
    public string? CustomerId { get; set; }

    /// <summary>
    /// Gets or sets contact customer name.
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer phone number.
    /// </summary>
    public string CustomerPhone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string CustomerEmail { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the target vehicle details.
    /// </summary>
    public BookingVehicleDto Vehicle { get; set; } = new();

    /// <summary>
    /// Gets or sets chosen service package identifiers.
    /// </summary>
    public List<string> ServiceIds { get; set; } = [];

    /// <summary>
    /// Gets or sets optional service package names.
    /// </summary>
    public List<string>? ServiceNames { get; set; }

    /// <summary>
    /// Gets or sets customer reported problem description.
    /// </summary>
    public string ProblemDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets selected symptoms list.
    /// </summary>
    public List<string>? Symptoms { get; set; }

    /// <summary>
    /// Gets or sets uploaded damage image URLs.
    /// </summary>
    public List<string>? DamageImages { get; set; }

    /// <summary>
    /// Gets or sets preferred master technician ID.
    /// </summary>
    public string? PreferredMechanicId { get; set; }

    /// <summary>
    /// Gets or sets preferred master technician name.
    /// </summary>
    public string? PreferredMechanicName { get; set; }

    /// <summary>
    /// Gets or sets appointment date (YYYY-MM-DD).
    /// </summary>
    public string AppointmentDate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets appointment time slot.
    /// </summary>
    public string AppointmentTime { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets intake handover choice ('drop_off' or 'wait_at_lounge').
    /// </summary>
    public string DropOffOption { get; set; } = "drop_off";

    /// <summary>
    /// Gets or sets initial estimated total cost in LKR.
    /// </summary>
    public decimal EstimatedPriceLkr { get; set; }
}

