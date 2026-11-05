using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for managing vehicle service repair bookings, customer appointment schedules, live telemetry tracking, and bay assignments.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="BookingsController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="bookingService">Booking business logic service.</param>
/// <param name="logger">Application logger.</param>
[ApiController]
[Route("api/[controller]")]
public class BookingsController(
    IBookingService bookingService,
    ILogger<BookingsController> logger) : ControllerBase
{
    private readonly IBookingService _bookingService = bookingService ?? throw new ArgumentNullException(nameof(bookingService));
    private readonly ILogger<BookingsController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Retrieves bookings based on role and filters. Administrators can browse all workshop bookings;
    /// customer accounts are securely scoped to their own appointments.
    /// </summary>
    /// <param name="status">Optional status filter (e.g. 'PENDING', 'CONFIRMED', 'IN_PROGRESS').</param>
    /// <param name="customerId">Optional customer identifier filter (administrators only).</param>
    /// <param name="search">Optional keyword search across reference code, plate, customer name, and model.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of matching bookings.</returns>
    /// <response code="200">List of bookings retrieved successfully.</response>
    /// <response code="401">Unauthorized.</response>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<BookingResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyList<BookingResponse>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? customerId,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User.FindFirstValue(ClaimTypes.Role)?.ToLowerInvariant();
        var isAdmin = currentUserRole is "admin" or "director" or "technician";

        // If not admin, restrict customerId to caller's own ID
        var targetCustomerId = isAdmin ? customerId : currentUserId;

        var result = await _bookingService.GetAllAsync(status, targetCustomerId, search, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves details for a specific booking by identifier.
    /// </summary>
    /// <param name="id">Booking primary identifier (e.g. 'book-1').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Booking details.</returns>
    /// <response code="200">Booking found.</response>
    /// <response code="404">Booking not found.</response>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingResponse>> GetById(string id, CancellationToken cancellationToken)
    {
        var booking = await _bookingService.GetByIdAsync(id, cancellationToken);
        if (booking is null)
        {
            return NotFound(new { message = $"Booking with ID '{id}' was not found." });
        }

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User.FindFirstValue(ClaimTypes.Role)?.ToLowerInvariant();
        var isAdmin = currentUserRole is "admin" or "director";

        if (!isAdmin && booking.CustomerId != currentUserId)
        {
            return Forbid();
        }

        return Ok(booking);
    }

    /// <summary>
    /// Looks up a booking by reference code (e.g. 'GRX-2026-8941') or vehicle license plate.
    /// Accessible publicly without authentication for real-time customer repair telemetry tracking.
    /// </summary>
    /// <param name="referenceOrPlate">Booking reference number or vehicle plate.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Current booking telemetry details.</returns>
    /// <response code="200">Booking found and telemetry returned.</response>
    /// <response code="404">No matching booking found.</response>
    [HttpGet("track/{referenceOrPlate}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingResponse>> TrackBooking(string referenceOrPlate, CancellationToken cancellationToken)
    {
        var booking = await _bookingService.GetByReferenceOrPlateAsync(referenceOrPlate, cancellationToken);
        if (booking is null)
        {
            return NotFound(new { message = $"No active or past repair found matching '{referenceOrPlate}'." });
        }

        return Ok(booking);
    }

    /// <summary>
    /// Retrieves all bookings belonging to a specific customer identifier.
    /// </summary>
    /// <param name="customerId">Customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of customer bookings.</returns>
    [HttpGet("customer/{customerId}")]
    [Authorize]
    [ProducesResponseType(typeof(IReadOnlyList<BookingResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<BookingResponse>>> GetCustomerBookings(string customerId, CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User.FindFirstValue(ClaimTypes.Role)?.ToLowerInvariant();
        var isAdmin = currentUserRole is "admin" or "director";

        if (!isAdmin && customerId != currentUserId)
        {
            return Forbid();
        }

        var result = await _bookingService.GetCustomerBookingsAsync(customerId, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new vehicle service intake booking.
    /// Can be invoked by authenticated customers or public guest intake.
    /// </summary>
    /// <param name="request">Booking submission payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Newly generated booking with tracking reference code.</returns>
    /// <response code="201">Booking created successfully.</response>
    /// <response code="400">Validation failure.</response>
    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BookingResponse>> Create(
        [FromBody] CreateBookingRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var created = await _bookingService.CreateAsync(request, currentUserId, cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Modifies booking appointment schedule, pricing, vehicle snapshot, or internal workshop notes.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated booking details.</returns>
    /// <response code="200">Booking updated successfully.</response>
    /// <response code="404">Booking not found.</response>
    [HttpPut("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingResponse>> Update(
        string id,
        [FromBody] UpdateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await _bookingService.UpdateAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Booking '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Transitions the repair lifecycle status of a booking (e.g. IN_PROGRESS, READY_FOR_PICKUP).
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Status update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated booking details.</returns>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingResponse>> UpdateStatus(
        string id,
        [FromBody] UpdateBookingStatusRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(new { message = "Status cannot be empty." });
        }

        var updated = await _bookingService.UpdateStatusAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Booking '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Assigns a technician to a vehicle repair booking.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Assignment payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated booking details.</returns>
    [HttpPatch("{id}/assign-mechanic")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingResponse>> AssignMechanic(
        string id,
        [FromBody] AssignMechanicRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.MechanicId))
        {
            return BadRequest(new { message = "MechanicId cannot be empty." });
        }

        var updated = await _bookingService.AssignMechanicAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound(new { message = $"Booking '{id}' was not found." });
        }

        return Ok(updated);
    }

    /// <summary>
    /// Cancels an active repair booking.
    /// Accessible to the customer owner or workshop administrators.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Cancellation payload with reason.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Cancelled booking details.</returns>
    [HttpPost("{id}/cancel")]
    [Authorize]
    [ProducesResponseType(typeof(BookingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookingResponse>> Cancel(
        string id,
        [FromBody] CancelBookingRequest request,
        CancellationToken cancellationToken)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var currentUserRole = User.FindFirstValue(ClaimTypes.Role)?.ToLowerInvariant();
        var isAdmin = currentUserRole is "admin" or "director";

        var cancelled = await _bookingService.CancelAsync(id, request, currentUserId, isAdmin, cancellationToken);
        if (cancelled is null)
        {
            return BadRequest(new { message = $"Cannot cancel booking '{id}'. It may not exist, belong to another customer, or has already completed delivery." });
        }

        return Ok(cancelled);
    }

    /// <summary>
    /// Permanently deletes a booking record.
    /// Restricted strictly to administrators.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Success confirmation.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id, CancellationToken cancellationToken)
    {
        var success = await _bookingService.DeleteAsync(id, cancellationToken);
        if (!success)
        {
            return NotFound(new { message = $"Booking '{id}' was not found." });
        }

        return NoContent();
    }
}
