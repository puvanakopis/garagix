using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for managing registered vehicle owners, customer accounts, and client vehicles.
/// Directory listings and status modifications are secured for administrators.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="CustomersController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="customerService">Customer business logic provider.</param>
/// <param name="logger">Application logging facility.</param>
[ApiController]
[Route("api/[controller]")]
public class CustomersController(
    ICustomerService customerService,
    ILogger<CustomersController> logger) : ControllerBase
{
    private readonly ICustomerService _customerService = customerService ?? throw new ArgumentNullException(nameof(customerService));
    private readonly ILogger<CustomersController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves all registered garage customers.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="status">Optional status filter ('active', 'inactive', 'ALL').</param>
    /// <param name="search">Optional keyword search across name, email, or telephone.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of matching customer profiles.</returns>
    /// <response code="200">Returns list of customer profiles.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden - Admin role required.</response>
    [HttpGet]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(IReadOnlyList<CustomerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IReadOnlyList<CustomerResponse>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var result = await _customerService.GetAllCustomersAsync(status, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves full customer dossier including registered vehicles by identifier.
    /// </summary>
    /// <param name="id">Customer user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The matching customer dossier.</returns>
    /// <response code="200">Returns the requested customer profile.</response>
    /// <response code="404">Customer not found.</response>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(CustomerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerResponse>> GetById(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _customerService.GetCustomerByIdAsync(id, cancellationToken);
        if (result is null)
        {
            return NotFound(new { message = $"Customer with identifier '{id}' was not found." });
        }

        return Ok(result);
    }

    /// <summary>
    /// Provisions a new customer account directly from administration.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="request">Customer creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The newly created customer profile.</returns>
    /// <response code="201">Customer registered successfully.</response>
    /// <response code="400">Validation failure.</response>
    [HttpPost]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(CustomerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerResponse>> Create(
        [FromBody] CreateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var created = await _customerService.CreateCustomerAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Updates an existing customer profile.
    /// </summary>
    /// <param name="id">Customer identifier.</param>
    /// <param name="request">Customer update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated customer profile.</returns>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(CustomerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerResponse>> Update(
        string id,
        [FromBody] UpdateCustomerRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _customerService.UpdateCustomerAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Customer with identifier '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Toggles customer active/inactive status.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="id">Customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated customer profile.</returns>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(CustomerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerResponse>> ToggleStatus(
        string id,
        CancellationToken cancellationToken)
    {
        var updated = await _customerService.ToggleCustomerStatusAsync(id, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Customer with identifier '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Removes a customer account from the workshop directory.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="id">Customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>No content on success.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        string id,
        CancellationToken cancellationToken)
    {
        var success = await _customerService.DeleteCustomerAsync(id, cancellationToken);
        if (!success)
        {
            return NotFound(new { message = $"Customer with identifier '{id}' was not found." });
        }

        return NoContent();
    }

    /// <summary>
    /// Retrieves all vehicles registered for a customer.
    /// </summary>
    /// <param name="id">Customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of registered vehicles.</returns>
    [HttpGet("{id}/vehicles")]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<VehicleResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<VehicleResponse>>> GetVehicles(
        string id,
        CancellationToken cancellationToken)
    {
        var vehicles = await _customerService.GetCustomerVehiclesAsync(id, cancellationToken);
        return Ok(vehicles);
    }

    /// <summary>
    /// Registers a new vehicle under a customer.
    /// </summary>
    /// <param name="id">Customer identifier.</param>
    /// <param name="request">Vehicle registration payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The created vehicle.</returns>
    [HttpPost("{id}/vehicles")]
    [Authorize]
    [ProducesResponseType(typeof(VehicleResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<VehicleResponse>> AddVehicle(
        string id,
        [FromBody] CreateVehicleRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var vehicle = await _customerService.AddVehicleAsync(id, request, cancellationToken);
        return CreatedAtAction(nameof(GetVehicles), new { id }, vehicle);
    }

    /// <summary>
    /// Removes a vehicle from a customer's registered fleet.
    /// </summary>
    /// <param name="id">Customer identifier.</param>
    /// <param name="vehicleId">Vehicle identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>No content on success.</returns>
    [HttpDelete("{id}/vehicles/{vehicleId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteVehicle(
        string id,
        string vehicleId,
        CancellationToken cancellationToken)
    {
        var success = await _customerService.DeleteVehicleAsync(id, vehicleId, cancellationToken);
        if (!success)
        {
            return NotFound(new { message = $"Vehicle with identifier '{vehicleId}' was not found for customer '{id}'." });
        }

        return NoContent();
    }
}

