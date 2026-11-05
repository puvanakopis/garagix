using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for serving consolidated dashboard analytics, operational KPIs, repair volume trends, and personalized customer garage telemetry.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="DashboardController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="dashboardService">Dashboard business logic service provider.</param>
/// <param name="logger">Application logger.</param>
[ApiController]
[Route("api/[controller]")]
public class DashboardController(
    IDashboardService dashboardService,
    ILogger<DashboardController> logger) : ControllerBase
{
    private readonly IDashboardService _dashboardService = dashboardService ?? throw new ArgumentNullException(nameof(dashboardService));
    private readonly ILogger<DashboardController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Compiles comprehensive operational telemetry, volume trends, category revenue breakdown, and today's appointments for workshop administrators.
    /// Restricted to administrators and workshop directors.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Administrator dashboard response payload.</returns>
    /// <response code="200">Admin dashboard data retrieved successfully.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpGet("admin")]
    [Authorize(Roles = "admin,Admin,director")]
    [ProducesResponseType(typeof(AdminDashboardResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<AdminDashboardResponse>> GetAdminDashboard(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetAdminDashboardAsync(cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Compiles personalized vehicle fleet records, active repair telemetry, upcoming visits, and summary metrics for the currently logged-in customer.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Customer dashboard response payload.</returns>
    /// <response code="200">Customer dashboard data retrieved successfully.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="404">Customer account not found.</response>
    [HttpGet("customer")]
    [Authorize]
    [ProducesResponseType(typeof(CustomerDashboardResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDashboardResponse>> GetCurrentCustomerDashboard(CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(currentUserId))
        {
            return Unauthorized(new { message = "Authentication token does not contain a valid user identifier." });
        }

        var result = await _dashboardService.GetCustomerDashboardAsync(currentUserId, cancellationToken);
        if (result is null)
        {
            return NotFound(new { message = $"Customer profile for identifier '{currentUserId}' was not found." });
        }

        return Ok(result);
    }

    /// <summary>
    /// Compiles customer dashboard data for a specific customer identifier.
    /// Accessible by administrators or by the customer themselves.
    /// </summary>
    /// <param name="customerId">Target customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Customer dashboard response payload.</returns>
    /// <response code="200">Customer dashboard data retrieved successfully.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden.</response>
    /// <response code="404">Customer account not found.</response>
    [HttpGet("customer/{customerId}")]
    [Authorize]
    [ProducesResponseType(typeof(CustomerDashboardResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDashboardResponse>> GetCustomerDashboardById(
        string customerId,
        CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User.FindFirstValue(ClaimTypes.Role)?.ToLowerInvariant();
        var isAdmin = currentUserRole is "admin" or "director";

        if (!isAdmin && !string.Equals(customerId, currentUserId, StringComparison.OrdinalIgnoreCase))
        {
            return Forbid();
        }

        var result = await _dashboardService.GetCustomerDashboardAsync(customerId, cancellationToken);
        if (result is null)
        {
            return NotFound(new { message = $"Customer profile for identifier '{customerId}' was not found." });
        }

        return Ok(result);
    }
}

