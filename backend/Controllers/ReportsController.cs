using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for compiling executive workshop intelligence, revenue analysis, service turnover, and CSV export.
/// Restricted to administrators and workshop directors.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="ReportsController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="reportService">Report business logic service.</param>
/// <param name="logger">Application logger.</param>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin,Admin,director")]
public class ReportsController(
    IReportService reportService,
    ILogger<ReportsController> logger) : ControllerBase
{
    private readonly IReportService _reportService = reportService ?? throw new ArgumentNullException(nameof(reportService));
    private readonly ILogger<ReportsController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves executive workshop throughput summary, revenue trajectory, service breakdown, and mechanic efficiency workloads.
    /// </summary>
    /// <param name="period">Optional reporting window filter (e.g. 'last_6_months', 'q3_2026', 'year_to_date').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Executive workshop intelligence summary.</returns>
    /// <response code="200">Executive summary report retrieved successfully.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpGet("summary")]
    [ProducesResponseType(typeof(ReportSummaryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ReportSummaryResponse>> GetSummary(
        [FromQuery] string? period,
        CancellationToken cancellationToken)
    {
        var summary = await _reportService.GetSummaryReportAsync(period, cancellationToken);
        return Ok(summary);
    }

    /// <summary>
    /// Generates and downloads a CSV report file of workshop performance and financials.
    /// </summary>
    /// <param name="period">Optional period filter.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>CSV file download.</returns>
    /// <response code="200">Returns text/csv file stream.</response>
    [HttpGet("export")]
    [Produces("text/csv")]
    public async Task<IActionResult> ExportCsv(
        [FromQuery] string? period,
        CancellationToken cancellationToken)
    {
        var csv = await _reportService.GenerateCsvReportAsync(period, cancellationToken);
        var bytes = Encoding.UTF8.GetBytes(csv);
        var fileName = $"garagix-workshop-report-{DateTime.UtcNow:yyyyMMdd}.csv";

        return File(bytes, "text/csv", fileName);
    }
}
