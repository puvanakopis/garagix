namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for cancelling an active repair booking.
/// </summary>
public class CancelBookingRequest
{
    /// <summary>
    /// Gets or sets cancellation justification reason.
    /// </summary>
    public string? Reason { get; set; }
}

