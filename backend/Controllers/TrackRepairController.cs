using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for real-time customer vehicle repair telemetry tracking, diagnostic bay milestone inspection, and live status feeds.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="TrackRepairController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="trackService">Repair tracking business logic service.</param>
/// <param name="logger">Application logger.</param>
[ApiController]
[Route("api/[controller]")]
[Route("api/track")]
[Route("api/track-repair")]
public class TrackRepairController(
    ITrackRepairService trackService,
    ILogger<TrackRepairController> logger) : ControllerBase
{
    private readonly ITrackRepairService _trackService = trackService ?? throw new ArgumentNullException(nameof(trackService));
    private readonly ILogger<TrackRepairController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves active workshop repair feeds for quick-switching in the customer tracking console.
    /// Publicly accessible without authentication.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of active telemetry job summaries.</returns>
    /// <response code="200">List of active feeds.</response>
    [HttpGet("active-feeds")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<TrackFeedSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TrackFeedSummaryDto>>> GetActiveFeeds(
        CancellationToken cancellationToken)
    {
        var list = await _trackService.GetActiveFeedsAsync(cancellationToken);
        return Ok(list);
    }

    /// <summary>
    /// Looks up real-time vehicle repair telemetry using booking reference code (e.g. 'GRX-2026-8941') or vehicle license plate.
    /// Publicly accessible without authentication.
    /// </summary>
    /// <param name="referenceOrPlate">Booking reference code or vehicle license plate.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Comprehensive telemetry status, milestone progress, vehicle specs, and technician diagnostic log.</returns>
    /// <response code="200">Telemetry retrieved successfully.</response>
    /// <response code="404">No matching repair found.</response>
    [HttpGet("{referenceOrPlate}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(TrackRepairResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TrackRepairResponse>> GetTelemetry(
        string referenceOrPlate,
        CancellationToken cancellationToken)
    {
        var result = await _trackService.GetTelemetryAsync(referenceOrPlate, cancellationToken);
        if (result is null)
        {
            return NotFound(new { message = $"No active or past repair job found matching '{referenceOrPlate}'." });
        }

        return Ok(result);
    }

    /// <summary>
    /// Retrieves active and recent repair jobs for an authenticated customer user.
    /// </summary>
    /// <param name="customerId">Customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of customer repair tracking summaries.</returns>
    /// <response code="200">Customer feeds retrieved successfully.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden.</response>
    [HttpGet("customer/{customerId}")]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<TrackFeedSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IReadOnlyList<TrackFeedSummaryDto>>> GetCustomerFeeds(
        string customerId,
        CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User.FindFirstValue(ClaimTypes.Role)?.ToLowerInvariant();
        var isAdmin = currentUserRole is "admin" or "director";

        if (!isAdmin && customerId != currentUserId)
        {
            return Forbid();
        }

        var list = await _trackService.GetCustomerFeedsAsync(customerId, cancellationToken);
        return Ok(list);
    }
}
