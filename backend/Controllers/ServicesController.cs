using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for managing the vehicle repair and maintenance service catalog.
/// Public users can query packages without authentication; create, update, and delete operations
/// are strictly restricted to administrators.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="ServicesController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="serviceCatalog">Service catalog business logic provider.</param>
/// <param name="logger">Application logging facility.</param>
[ApiController]
[Route("api/[controller]")]
[Route("api/service-catalog")]
public class ServicesController(
    IServiceCatalogService serviceCatalog,
    ILogger<ServicesController> logger) : ControllerBase
{
    private readonly IServiceCatalogService _serviceCatalog = serviceCatalog ?? throw new ArgumentNullException(nameof(serviceCatalog));
    private readonly ILogger<ServicesController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves all vehicle service packages from the catalog.
    /// Accessible publicly without authentication.
    /// </summary>
    /// <param name="activeOnly">Optional filter to return only active services (defaults to all for admin, active for public clients).</param>
    /// <param name="category">Optional category filter (e.g. 'Maintenance', 'Diagnostics').</param>
    /// <param name="search">Optional search keyword across title, category, and short description.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of matching service package objects.</returns>
    /// <response code="200">Returns list of matching service catalog packages.</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<ServiceResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ServiceResponse>>> GetAll(
        [FromQuery] bool? activeOnly,
        [FromQuery] string? category,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _serviceCatalog.GetAllAsync(activeOnly, category, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves the list of unique service categories.
    /// Accessible publicly without authentication.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of category names.</returns>
    /// <response code="200">List of category strings.</response>
    [HttpGet("categories")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IReadOnlyList<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCategories(CancellationToken cancellationToken)
    {
        var categories = await _serviceCatalog.GetCategoriesAsync(cancellationToken);
        return Ok(categories);
    }

    /// <summary>
    /// Retrieves details for a specific service package by ID or URL slug.
    /// Accessible publicly without authentication.
    /// </summary>
    /// <param name="idOrSlug">The primary ID (e.g. 'srv-1') or URL slug.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Service package details.</returns>
    /// <response code="200">Service found and returned.</response>
    /// <response code="404">No service matches the specified identifier or slug.</response>
    [HttpGet("{idOrSlug}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ServiceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ServiceResponse>> GetByIdOrSlug(
        string idOrSlug,
        CancellationToken cancellationToken)
    {
        var service = await _serviceCatalog.GetByIdOrSlugAsync(idOrSlug, cancellationToken);
        if (service == null)
        {
            return NotFound(new { message = $"Service package '{idOrSlug}' was not found in the catalog." });
        }

        return Ok(service);
    }

    /// <summary>
    /// Creates a new service package in the catalog.
    /// Requires administrator role.
    /// </summary>
    /// <param name="request">Service package creation details.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The created service package.</returns>
    /// <response code="201">Service created successfully.</response>
    /// <response code="400">Request validation failed.</response>
    /// <response code="401">Caller is not authenticated.</response>
    /// <response code="403">Caller is not an administrator.</response>
    [HttpPost]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(ServiceResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ServiceResponse>> Create(
        [FromBody] CreateServiceRequest request,
        CancellationToken cancellationToken)
    {
        var created = await _serviceCatalog.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByIdOrSlug), new { idOrSlug = created.Id }, created);
    }

    /// <summary>
    /// Updates an existing service package.
    /// Requires administrator role.
    /// </summary>
    /// <param name="id">Identifier of the service package to update.</param>
    /// <param name="request">Updated service package fields.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated service package.</returns>
    /// <response code="200">Service updated successfully.</response>
    /// <response code="400">Request validation failed.</response>
    /// <response code="401">Caller is not authenticated.</response>
    /// <response code="403">Caller is not an administrator.</response>
    /// <response code="404">Service package does not exist.</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(ServiceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ServiceResponse>> Update(
        string id,
        [FromBody] UpdateServiceRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await _serviceCatalog.UpdateAsync(id, request, cancellationToken);
        if (updated == null)
        {
            return NotFound(new { message = $"Service package with ID '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Deletes a service package from the catalog.
    /// Requires administrator role.
    /// </summary>
    /// <param name="id">Identifier of the service package to remove.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Success status confirmation.</returns>
    /// <response code="200">Service deleted successfully.</response>
    /// <response code="401">Caller is not authenticated.</response>
    /// <response code="403">Caller is not an administrator.</response>
    /// <response code="404">Service package does not exist.</response>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        string id,
        CancellationToken cancellationToken)
    {
        var deleted = await _serviceCatalog.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound(new { message = $"Service package with ID '{id}' was not found." });
        }

        return Ok(new { message = "Service package removed from catalog successfully." });
    }
}

