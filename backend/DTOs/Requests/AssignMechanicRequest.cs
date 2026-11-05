namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for assigning a technician to a vehicle repair booking.
/// </summary>
public class AssignMechanicRequest
{
    /// <summary>
    /// Gets or sets the target technician unique identifier.
    /// </summary>
    public string MechanicId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the target technician display name.
    /// </summary>
    public string? MechanicName { get; set; }
}
