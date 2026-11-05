namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for updating a booking's repair lifecycle status.
/// </summary>
public class UpdateBookingStatusRequest
{
    /// <summary>
    /// Gets or sets the target repair status (e.g., 'IN_PROGRESS', 'QUALITY_CHECK', 'READY_FOR_PICKUP').
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets optional manual progress percentage (0 - 100).
    /// </summary>
    public int? ProgressPercent { get; set; }

    /// <summary>
    /// Gets or sets optional transition notes.
    /// </summary>
    public string? Note { get; set; }
}

