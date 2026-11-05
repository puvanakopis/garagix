namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Data transfer object representing monthly aggregated repair statistics.
/// </summary>
public class MonthlyStatisticDto
{
    /// <summary>
    /// Gets or sets month label (e.g., 'Jun', 'Jul 2026').
    /// </summary>
    public string Month { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets total bookings count received.
    /// </summary>
    public int BookingsCount { get; set; }

    /// <summary>
    /// Gets or sets count of completed and delivered vehicle repairs.
    /// </summary>
    public int CompletedCount { get; set; }

    /// <summary>
    /// Gets or sets revenue in LKR for the month.
    /// </summary>
    public decimal RevenueLkr { get; set; }
}

/// <summary>
/// Data transfer object representing individual service category throughput and revenue.
/// </summary>
public class ServiceStatisticDto
{
    /// <summary>
    /// Gets or sets service package title.
    /// </summary>
    public string ServiceName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets number of bookings executed for this service.
    /// </summary>
    public int BookingsCount { get; set; }

    /// <summary>
    /// Gets or sets cumulative revenue generated in LKR.
    /// </summary>
    public decimal RevenueLkr { get; set; }

    /// <summary>
    /// Gets or sets percentage share of overall service volume (0 - 100).
    /// </summary>
    public int Percentage { get; set; }
}

/// <summary>
/// Data transfer object representing master technician turnaround and bay workload distribution.
/// </summary>
public class MechanicWorkloadDto
{
    /// <summary>
    /// Gets or sets technician identifier.
    /// </summary>
    public string MechanicId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets technician full name.
    /// </summary>
    public string MechanicName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets count of active repairs currently assigned in bay.
    /// </summary>
    public int ActiveRepairs { get; set; }

    /// <summary>
    /// Gets or sets count of jobs completed this month.
    /// </summary>
    public int CompletedThisMonth { get; set; }

    /// <summary>
    /// Gets or sets quality inspection score / efficiency rating (0 - 100).
    /// </summary>
    public int EfficiencyScore { get; set; }

    /// <summary>
    /// Gets or sets technical specialization.
    /// </summary>
    public string Specialization { get; set; } = string.Empty;
}

/// <summary>
/// Composite data transfer object representing the executive workshop intelligence summary.
/// </summary>
public class ReportSummaryResponse
{
    /// <summary>
    /// Gets or sets total bookings count.
    /// </summary>
    public int TotalBookings { get; set; }

    /// <summary>
    /// Gets or sets count of completed repairs.
    /// </summary>
    public int CompletedBookings { get; set; }

    /// <summary>
    /// Gets or sets count of cancelled bookings.
    /// </summary>
    public int CancelledBookings { get; set; }

    /// <summary>
    /// Gets or sets count of pending intake bookings.
    /// </summary>
    public int PendingBookings { get; set; }

    /// <summary>
    /// Gets or sets gross cumulative billing in LKR.
    /// </summary>
    public decimal TotalRevenueLkr { get; set; }

    /// <summary>
    /// Gets or sets average repair invoice in LKR.
    /// </summary>
    public decimal AverageRepairCostLkr { get; set; }

    /// <summary>
    /// Gets or sets monthly throughput and revenue trajectory.
    /// </summary>
    public IReadOnlyList<MonthlyStatisticDto> MonthlyStats { get; set; } = [];

    /// <summary>
    /// Gets or sets top service lines by demand and turnover.
    /// </summary>
    public IReadOnlyList<ServiceStatisticDto> TopServices { get; set; } = [];

    /// <summary>
    /// Gets or sets technician efficiency and workload distribution.
    /// </summary>
    public IReadOnlyList<MechanicWorkloadDto> MechanicWorkloads { get; set; } = [];
}
