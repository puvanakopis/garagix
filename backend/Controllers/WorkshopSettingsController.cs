using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for retrieving and updating garage workshop configuration, operating hours, and booking policies.
/// Public clients can view workshop settings; modifications are strictly restricted to administrators.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="WorkshopSettingsController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="settingsService">Workshop settings service instance.</param>
/// <param name="logger">Application logger.</param>
[ApiController]
[Route("api/[controller]")]
[Route("api/settings")]
[Route("api/workshop-settings")]
public class WorkshopSettingsController(
    IWorkshopSettingsService settingsService,
    ILogger<WorkshopSettingsController> logger) : ControllerBase
{
    private readonly IWorkshopSettingsService _settingsService = settingsService ?? throw new ArgumentNullException(nameof(settingsService));
    private readonly ILogger<WorkshopSettingsController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves current workshop configuration, operating hours, and booking constraints.
    /// Accessible publicly without authentication.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Workshop settings and policies.</returns>
    /// <response code="200">Returns current workshop settings.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(WorkshopSettingsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<WorkshopSettingsResponse>> GetSettings(CancellationToken cancellationToken)
    {
        var settings = await _settingsService.GetSettingsAsync(cancellationToken);
        return Ok(settings);
    }

    /// <summary>
    /// Updates workshop configuration, operating hours, hydraulic bay capacity, or notification preferences.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="request">Update payload with configuration values.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated workshop configuration.</returns>
    /// <response code="200">Workshop settings successfully updated.</response>
    /// <response code="400">Invalid payload or constraint violation.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpPut]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(WorkshopSettingsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<WorkshopSettingsResponse>> UpdateSettings(
        [FromBody] UpdateWorkshopSettingsRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var updated = await _settingsService.UpdateSettingsAsync(request, cancellationToken);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating workshop settings.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Failed to update workshop settings." });
        }
    }
}

