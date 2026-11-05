namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object representing top-level operational metrics and workshop bay statistics for administrators.
/// </summary>
public class AdminDashboardMetricsDto
{
    /// <summary>
    /// Gets or sets count of vehicles currently in workshop bays (in progress, waiting for parts, quality check, ready).
    /// </summary>
    public int InWorkshopCount { get; set; }

    /// <summary>
    /// Gets or sets count of bookings awaiting intake confirmation.
    /// </summary>
    public int PendingIntakeCount { get; set; }

    /// <summary>
    /// Gets or sets count of bookings with confirmed appointment slots.
    /// </summary>
    public int ConfirmedCount { get; set; }

    /// <summary>
    /// Gets or sets count of delivered or completed vehicle repairs.
    /// </summary>
    public int CompletedCount { get; set; }

    /// <summary>
    /// Gets or sets total all-time bookings count.
    /// </summary>
    public int TotalBookingsCount { get; set; }

    /// <summary>
    /// Gets or sets count of registered garage clients.
    /// </summary>
    public int TotalCustomersCount { get; set; }

    /// <summary>
    /// Gets or sets count of master technicians employed in workshop.
    /// </summary>
    public int TotalMechanicsCount { get; set; }

    /// <summary>
    /// Gets or sets pipeline estimated revenue from active and pending bookings in LKR.
    /// </summary>
    public decimal PipelineRevenueLkr { get; set; }

    /// <summary>
    /// Gets or sets realized cumulative revenue from completed repairs in LKR.
    /// </summary>
    public decimal RealizedRevenueLkr { get; set; }

    /// <summary>
    /// Gets or sets total operational hydraulic bays configured.
    /// </summary>
    public int HydraulicBays { get; set; }
}

/// <summary>
/// Data transfer object for monthly repair intake and completion volume trends.
/// </summary>
public class MonthlyRepairVolumeDto
{
    /// <summary>
    /// Gets or sets short month label (e.g. 'Jun', 'Jul').
    /// </summary>
    public string Month { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets full month display name (e.g. 'Jun 2026').
    /// </summary>
    public string MonthFull { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets bookings received during the month.
    /// </summary>
    public int BookingsCount { get; set; }

    /// <summary>
    /// Gets or sets completed vehicles handed over during the month.
    /// </summary>
    public int CompletedCount { get; set; }

    /// <summary>
    /// Gets or sets gross revenue generated during the month in LKR.
    /// </summary>
    public decimal RevenueLkr { get; set; }
}

/// <summary>
/// Data transfer object for service category revenue contribution and proportion.
/// </summary>
public class CategoryRevenueDto
{
    /// <summary>
    /// Gets or sets service category title.
    /// </summary>
    public string CategoryName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets percentage share of total revenue (0 - 100).
    /// </summary>
    public int Percentage { get; set; }

    /// <summary>
    /// Gets or sets total earnings from this service category in LKR.
    /// </summary>
    public decimal RevenueLkr { get; set; }

    /// <summary>
    /// Gets or sets total number of service bookings executed.
    /// </summary>
    public int BookingsCount { get; set; }
}

/// <summary>
/// Data transfer object for today's scheduled bay appointment item.
/// </summary>
public class TodayAppointmentDto
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
    /// Gets or sets customer full name.
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle license plate.
    /// </summary>
    public string VehiclePlate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle brand.
    /// </summary>
    public string VehicleBrand { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle model.
    /// </summary>
    public string VehicleModel { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets primary requested service name.
    /// </summary>
    public string PrimaryService { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets appointment intake date.
    /// </summary>
    public string AppointmentDate { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets appointment intake time slot.
    /// </summary>
    public string AppointmentTime { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets repair status.
    /// </summary>
    public string Status { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets milestone progress percent (0 - 100).
    /// </summary>
    public int ProgressPercent { get; set; }

    /// <summary>
    /// Gets or sets estimated repair price in LKR.
    /// </summary>
    public decimal EstimatedPriceLkr { get; set; }
}

/// <summary>
/// Composite response payload for the Admin Workshop Control HQ Dashboard.
/// </summary>
public class AdminDashboardResponse
{
    /// <summary>
    /// Gets or sets top-level operational metrics.
    /// </summary>
    public AdminDashboardMetricsDto Metrics { get; set; } = new();

    /// <summary>
    /// Gets or sets monthly repair volume trends over the past 6 months.
    /// </summary>
    public IReadOnlyList<MonthlyRepairVolumeDto> MonthlyVolume { get; set; } = [];

    /// <summary>
    /// Gets or sets revenue breakdown by service category.
    /// </summary>
    public IReadOnlyList<CategoryRevenueDto> RevenueByCategory { get; set; } = [];

    /// <summary>
    /// Gets or sets today's workshop bay appointments.
    /// </summary>
    public IReadOnlyList<TodayAppointmentDto> TodayAppointments { get; set; } = [];
}

