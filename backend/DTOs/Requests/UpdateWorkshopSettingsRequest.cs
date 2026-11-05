namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for updating garage facility configuration and booking policies.
/// </summary>
public class UpdateWorkshopSettingsRequest
{
    /// <summary>
    /// Gets or sets the workshop brand name.
    /// </summary>
    public string? WorkshopName { get; set; }

    /// <summary>
    /// Gets or sets the business registration number.
    /// </summary>
    public string? RegNumber { get; set; }

    /// <summary>
    /// Gets or sets primary telephone contact.
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Gets or sets 24/7 emergency hotline.
    /// </summary>
    public string? EmergencyPhone { get; set; }

    /// <summary>
    /// Gets or sets public correspondence email.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets physical facility address.
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// Gets or sets workshop introductory description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets primary facility bay designation.
    /// </summary>
    public string? FacilityBay { get; set; }

    /// <summary>
    /// Gets or sets garage operational status.
    /// </summary>
    public string? WorkshopStatus { get; set; }

    /// <summary>
    /// Gets or sets alerts engine status string.
    /// </summary>
    public string? AlertsEngineStatus { get; set; }

    /// <summary>
    /// Gets or sets weekday opening time (HH:mm).
    /// </summary>
    public string? MondayFridayOpen { get; set; }

    /// <summary>
    /// Gets or sets weekday closing time (HH:mm).
    /// </summary>
    public string? MondayFridayClose { get; set; }

    /// <summary>
    /// Gets or sets Saturday operating hours string.
    /// </summary>
    public string? SaturdayHours { get; set; }

    /// <summary>
    /// Gets or sets Sunday operating hours policy.
    /// </summary>
    public string? SundayHours { get; set; }

    /// <summary>
    /// Gets or sets active operating days array.
    /// </summary>
    public List<string>? ActiveWorkingDays { get; set; }

    /// <summary>
    /// Gets or sets intake slot duration in minutes.
    /// </summary>
    public int? SlotDurationMinutes { get; set; }

    /// <summary>
    /// Gets or sets total concurrent hydraulic bays.
    /// </summary>
    public int? ConcurrentHydraulicBays { get; set; }

    /// <summary>
    /// Gets or sets free cancellation window in hours.
    /// </summary>
    public int? FreeCancellationHours { get; set; }

    /// <summary>
    /// Gets or sets maximum advance booking window in days.
    /// </summary>
    public int? MaxAdvanceBookingDays { get; set; }

    /// <summary>
    /// Gets or sets whether automatic booking confirmation SMS is active.
    /// </summary>
    public bool? AutomatedBookingConfirmationSms { get; set; }

    /// <summary>
    /// Gets or sets whether technician status broadcasts are active.
    /// </summary>
    public bool? TechnicianStatusChangeBroadcast { get; set; }

    /// <summary>
    /// Gets or sets whether vehicle ready notifications are active.
    /// </summary>
    public bool? CollectionBayReadyNotification { get; set; }
}

