namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object exposing workshop facility details, working hours, and operational rules.
/// </summary>
public class WorkshopSettingsResponse
{
    /// <summary>
    /// Gets or sets configuration identifier.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the workshop brand name.
    /// </summary>
    public string WorkshopName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets business registration identifier.
    /// </summary>
    public string RegNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer intake and inquiry telephone.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets 24/7 emergency roadside recovery line.
    /// </summary>
    public string EmergencyPhone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer service email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets physical workshop facility location address.
    /// </summary>
    public string Address { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets garage description and mission text.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets primary facility bay designation.
    /// </summary>
    public string FacilityBay { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets workshop operating status.
    /// </summary>
    public string WorkshopStatus { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets alert engine status.
    /// </summary>
    public string AlertsEngineStatus { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets weekday opening time (e.g. '08:00').
    /// </summary>
    public string MondayFridayOpen { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets weekday closing time (e.g. '18:30').
    /// </summary>
    public string MondayFridayClose { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets Saturday operating hours string.
    /// </summary>
    public string SaturdayHours { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets Sunday operating hours string.
    /// </summary>
    public string SundayHours { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the list of active working days (e.g. ['Monday', 'Tuesday', ...]).
    /// </summary>
    public IReadOnlyList<string> ActiveWorkingDays { get; set; } = [];

    /// <summary>
    /// Gets or sets standard slot interval in minutes.
    /// </summary>
    public int SlotDurationMinutes { get; set; }

    /// <summary>
    /// Gets or sets count of concurrent active hydraulic bays.
    /// </summary>
    public int ConcurrentHydraulicBays { get; set; }

    /// <summary>
    /// Gets or sets free cancellation window in hours.
    /// </summary>
    public int FreeCancellationHours { get; set; }

    /// <summary>
    /// Gets or sets maximum days in advance an appointment can be reserved.
    /// </summary>
    public int MaxAdvanceBookingDays { get; set; }

    /// <summary>
    /// Gets or sets whether automated booking SMS is enabled.
    /// </summary>
    public bool AutomatedBookingConfirmationSms { get; set; }

    /// <summary>
    /// Gets or sets whether status change updates are broadcasted to customers.
    /// </summary>
    public bool TechnicianStatusChangeBroadcast { get; set; }

    /// <summary>
    /// Gets or sets whether vehicle ready notifications are broadcasted.
    /// </summary>
    public bool CollectionBayReadyNotification { get; set; }

    /// <summary>
    /// Gets or sets timestamp when configuration was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets timestamp when configuration was last saved.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}

