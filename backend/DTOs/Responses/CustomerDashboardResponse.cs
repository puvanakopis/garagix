namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object representing customer identity summary for dashboard greeting.
/// </summary>
public class CustomerSummaryDto
{
    /// <summary>
    /// Gets or sets customer user identifier.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets full customer name.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer first name for personalized dashboard greeting.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer telephone number.
    /// </summary>
    public string Phone { get; set; } = string.Empty;
}

/// <summary>
/// Data transfer object for customer dashboard top-level summary chips.
/// </summary>
public class CustomerDashboardMetricsDto
{
    /// <summary>
    /// Gets or sets count of customer vehicles currently being serviced in workshop bays.
    /// </summary>
    public int InWorkshopCount { get; set; }

    /// <summary>
    /// Gets or sets count of upcoming confirmed or pending service visits.
    /// </summary>
    public int UpcomingCount { get; set; }

    /// <summary>
    /// Gets or sets count of registered vehicles in customer garage.
    /// </summary>
    public int SavedVehiclesCount { get; set; }

    /// <summary>
    /// Gets or sets count of completed past services.
    /// </summary>
    public int CompletedCount { get; set; }

    /// <summary>
    /// Gets or sets cumulative amount spent on completed services in LKR.
    /// </summary>
    public decimal TotalSpentLkr { get; set; }
}

/// <summary>
/// Data transfer object for active vehicle repair live telemetry displayed prominently on customer dashboard.
/// </summary>
public class CustomerActiveRepairTelemetryDto
{
    /// <summary>
    /// Gets or sets booking primary identifier.
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets unique reference code (e.g. 'GRX-2026-8941').
    /// </summary>
    public string ReferenceNumber { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle license plate.
    /// </summary>
    public string VehiclePlate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle model.
    /// </summary>
    public string VehicleModel { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets repair status (e.g. 'IN_PROGRESS', 'QUALITY_CHECK').
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets progress percentage (0 - 100).
    /// </summary>
    public int ProgressPercent { get; set; }

    /// <summary>
    /// Gets or sets estimated bay delivery or handover time.
    /// </summary>
    public string EstimatedCompletion { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets assigned specialist technician name.
    /// </summary>
    public string AssignedMechanicName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets latest technician diagnosis note.
    /// </summary>
    public string? InternalNotes { get; set; }

    /// <summary>
    /// Gets or sets scheduled appointment date.
    /// </summary>
    public string AppointmentDate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets scheduled appointment time slot.
    /// </summary>
    public string AppointmentTime { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets estimated repair price in LKR.
    /// </summary>
    public decimal EstimatedPriceLkr { get; set; }
}

/// <summary>
/// Composite response payload for the Customer Portal Dashboard.
/// </summary>
public class CustomerDashboardResponse
{
    /// <summary>
    /// Gets or sets customer identity summary.
    /// </summary>
    public CustomerSummaryDto Customer { get; set; } = new();

    /// <summary>
    /// Gets or sets customer dashboard metric chips.
    /// </summary>
    public CustomerDashboardMetricsDto Metrics { get; set; } = new();

    /// <summary>
    /// Gets or sets active vehicle repair telemetry if any vehicle is currently in workshop.
    /// </summary>
    public CustomerActiveRepairTelemetryDto? ActiveRepair { get; set; }

    /// <summary>
    /// Gets or sets registered garage vehicles for this customer.
    /// </summary>
    public IReadOnlyList<VehicleResponse> Vehicles { get; set; } = [];

    /// <summary>
    /// Gets or sets recent service visits and repair records.
    /// </summary>
    public IReadOnlyList<BookingResponse> RecentVisits { get; set; } = [];
}

