using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for managing workshop technicians and mechanics in the Garagix garage directory.
/// Public clients can view technician profiles; roster modifications are restricted to administrators.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="MechanicsController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="mechanicService">Mechanic business logic provider.</param>
/// <param name="logger">Application logging facility.</param>
[ApiController]
[Route("api/[controller]")]
[Route("api/technicians")]
public class MechanicsController(
    IMechanicService mechanicService,
    ILogger<MechanicsController> logger) : ControllerBase
{
    private readonly IMechanicService _mechanicService = mechanicService ?? throw new ArgumentNullException(nameof(mechanicService));
    private readonly ILogger<MechanicsController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves all master technicians from the workshop directory.
    /// Accessible publicly without authentication.
    /// </summary>
    /// <param name="status">Optional status filter ('available', 'busy', 'on_leave').</param>
    /// <param name="search">Optional search query matching name, title, or specialization.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of matching technician profiles.</returns>
    /// <response code="200">Returns list of technicians.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<MechanicResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MechanicResponse>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _mechanicService.GetAllAsync(status, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a single technician by unique identifier.
    /// Accessible publicly without authentication.
    /// </summary>
    /// <param name="id">Technician identifier (e.g. 'mech-1').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The matching technician profile.</returns>
    /// <response code="200">Returns the requested technician.</response>
    /// <response code="404">Technician not found.</response>
    [HttpGet("{id}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(MechanicResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MechanicResponse>> GetById(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _mechanicService.GetByIdAsync(id, cancellationToken);
        if (result is null)
        {
            return NotFound(new { message = $"Technician with identifier '{id}' was not found." });
        }

        return Ok(result);
    }

    /// <summary>
    /// Registers a new technician to the workshop roster.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="request">Technician registration payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The newly created technician profile.</returns>
    /// <response code="201">Technician registered successfully.</response>
    /// <response code="400">Validation failure.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpPost]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(MechanicResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<MechanicResponse>> Create(
        [FromBody] CreateMechanicRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var created = await _mechanicService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Updates an existing technician's profile details.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="id">Technician identifier to modify.</param>
    /// <param name="request">Technician update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated technician profile.</returns>
    /// <response code="200">Technician profile updated successfully.</response>
    /// <response code="404">Technician not found.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(MechanicResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<MechanicResponse>> Update(
        string id,
        [FromBody] UpdateMechanicRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _mechanicService.UpdateAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Technician with identifier '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Updates availability status of a technician.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="id">Technician identifier.</param>
    /// <param name="status">New availability status ('available', 'busy', 'on_leave').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated technician profile.</returns>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(MechanicResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MechanicResponse>> UpdateStatus(
        string id,
        [FromQuery] string status,
        CancellationToken cancellationToken)
    {
        var updated = await _mechanicService.UpdateStatusAsync(id, status, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Technician with identifier '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Removes a technician from the workshop roster.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="id">Technician identifier to delete.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>No content on success.</returns>
    /// <response code="204">Technician removed successfully.</response>
    /// <response code="404">Technician not found.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(
        string id,
        CancellationToken cancellationToken)
    {
        var success = await _mechanicService.DeleteAsync(id, cancellationToken);
        if (!success)
        {
            return NotFound(new { message = $"Technician with identifier '{id}' was not found." });
        }

        return NoContent();
    }
}

