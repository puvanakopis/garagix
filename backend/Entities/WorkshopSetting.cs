namespace Garagix.Api.Entities;

/// <summary>
/// Represents garage facility configuration, operating hours, booking rules, and notification preferences.
/// </summary>
public class WorkshopSetting
{
    /// <summary>
    /// Gets or sets the unique configuration record identifier (typically 'default').
    /// </summary>
    public string Id { get; set; } = "default";

    /// <summary>
    /// Gets or sets the public workshop brand or facility name.
    /// </summary>
    public string WorkshopName { get; set; } = "Garagix Auto Care HQ";

    /// <summary>
    /// Gets or sets the legal business registration number.
    /// </summary>
    public string RegNumber { get; set; } = "PV-124991-LK";

    /// <summary>
    /// Gets or sets the primary customer reception and service contact phone number.
    /// </summary>
    public string Phone { get; set; } = "+94 11 234 5678";

    /// <summary>
    /// Gets or sets the 24/7 emergency roadside recovery hotline.
    /// </summary>
    public string EmergencyPhone { get; set; } = "(+94) 77 123 4567";

    /// <summary>
    /// Gets or sets the public workshop email address for correspondence.
    /// </summary>
    public string Email { get; set; } = "service@garagix.lk";

    /// <summary>
    /// Gets or sets the physical workshop address.
    /// </summary>
    public string Address { get; set; } = "No. 45/A, Nawala Road, Nugegoda, Colombo, Sri Lanka";

    /// <summary>
    /// Gets or sets the workshop mission statement or public introduction.
    /// </summary>
    public string Description { get; set; } = "Premier automotive engineering and computerized diagnostic center specializing in Japanese, European, and Hybrid vehicles.";

    /// <summary>
    /// Gets or sets the primary facility bay or branch station name.
    /// </summary>
    public string FacilityBay { get; set; } = "Colombo Central";

    /// <summary>
    /// Gets or sets the current operational status of the workshop (e.g., 'Operational', 'Maintenance', 'Closed').
    /// </summary>
    public string WorkshopStatus { get; set; } = "Operational";

    /// <summary>
    /// Gets or sets the status string for the dispatch alert engine (e.g., 'SMS &amp; Email Live').
    /// </summary>
    public string AlertsEngineStatus { get; set; } = "SMS & Email Live";

    /// <summary>
    /// Gets or sets the weekday opening time (24-hour format HH:mm, e.g. '08:00').
    /// </summary>
    public string MondayFridayOpen { get; set; } = "08:00";

    /// <summary>
    /// Gets or sets the weekday closing time (24-hour format HH:mm, e.g. '18:30').
    /// </summary>
    public string MondayFridayClose { get; set; } = "18:30";

    /// <summary>
    /// Gets or sets the Saturday operating hours description.
    /// </summary>
    public string SaturdayHours { get; set; } = "08:00 AM - 05:00 PM";

    /// <summary>
    /// Gets or sets the Sunday operating policy description.
    /// </summary>
    public string SundayHours { get; set; } = "Emergency Breakdown Intake Only";

    /// <summary>
    /// Gets or sets comma-separated active operating days (e.g. 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday').
    /// </summary>
    public string ActiveWorkingDays { get; set; } = "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday";

    /// <summary>
    /// Gets or sets the standard duration in minutes per repair or intake slot.
    /// </summary>
    public int SlotDurationMinutes { get; set; } = 60;

    /// <summary>
    /// Gets or sets the number of concurrent active hydraulic repair bays.
    /// </summary>
    public int ConcurrentHydraulicBays { get; set; } = 6;

    /// <summary>
    /// Gets or sets the free cancellation window in hours prior to the appointment.
    /// </summary>
    public int FreeCancellationHours { get; set; } = 4;

    /// <summary>
    /// Gets or sets the maximum forward booking window in days.
    /// </summary>
    public int MaxAdvanceBookingDays { get; set; } = 30;

    /// <summary>
    /// Gets or sets whether automatic booking confirmation SMS alerts are dispatched.
    /// </summary>
    public bool AutomatedBookingConfirmationSms { get; set; } = true;

    /// <summary>
    /// Gets or sets whether technician repair status transitions trigger notifications.
    /// </summary>
    public bool TechnicianStatusChangeBroadcast { get; set; } = true;

    /// <summary>
    /// Gets or sets whether vehicle collection readiness triggers customer alerts.
    /// </summary>
    public bool CollectionBayReadyNotification { get; set; } = true;

    /// <summary>
    /// Gets or sets the date and time when the configuration record was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the date and time when the configuration was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
