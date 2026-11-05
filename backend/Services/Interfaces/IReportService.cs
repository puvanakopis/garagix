using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for compiling executive workshop intelligence, financial throughput, and technician productivity reports.
/// </summary>
public interface IReportService
{
    /// <summary>
    /// Compiles an executive summary report including monthly statistics, service line turnovers, and mechanic workloads.
    /// </summary>
    /// <param name="period">Optional reporting period (e.g. 'last_6_months', 'q3_2026', 'year_to_date').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Executive report summary.</returns>
    Task<ReportSummaryResponse> GetSummaryReportAsync(string? period = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates raw CSV formatted report string for download.
    /// </summary>
    /// <param name="period">Optional reporting period.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>CSV formatted string.</returns>
    Task<string> GenerateCsvReportAsync(string? period = null, CancellationToken cancellationToken = default);
}
