using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for workshop repair booking lifecycle, slot scheduling, status progression, and tracking.
/// </summary>
public interface IBookingService
{
    /// <summary>
    /// Retrieves all bookings filtered by optional status, customer ID, or search keyword.
    /// </summary>
    /// <param name="status">Optional status filter (e.g. 'PENDING', 'CONFIRMED', 'IN_PROGRESS').</param>
    /// <param name="customerId">Optional customer identifier filter.</param>
    /// <param name="search">Optional keyword matching reference, customer name, plate, or vehicle model.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of matching bookings.</returns>
    Task<IReadOnlyList<BookingResponse>> GetAllAsync(
        string? status = null,
        string? customerId = null,
        string? search = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single booking by unique primary identifier.
    /// </summary>
    /// <param name="id">Booking identifier (e.g. 'book-1').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Booking details, or null if not found.</returns>
    Task<BookingResponse?> GetByIdAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Looks up a booking by customer tracking reference code (e.g., 'GRX-2026-8941') or vehicle license plate.
    /// Accessible publicly for live workshop telemetry tracking without mandatory authentication.
    /// </summary>
    /// <param name="referenceOrPlate">Booking reference code or vehicle plate number.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Booking telemetry details, or null if not found.</returns>
    Task<BookingResponse?> GetByReferenceOrPlateAsync(string referenceOrPlate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all bookings belonging to a specific customer account.
    /// </summary>
    /// <param name="customerId">Customer account identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of customer bookings.</returns>
    Task<IReadOnlyList<BookingResponse>> GetCustomerBookingsAsync(string customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new vehicle service intake booking.
    /// </summary>
    /// <param name="request">Booking submission details.</param>
    /// <param name="authenticatedUserId">Optional authenticated user ID associated with the booking.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Newly generated booking with tracking reference.</returns>
    Task<BookingResponse> CreateAsync(CreateBookingRequest request, string? authenticatedUserId = null, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates general booking parameters, vehicle specs, financials, and internal notes.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="id">Booking identifier to update.</param>
    /// <param name="request">Update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated booking, or null if not found.</returns>
    Task<BookingResponse?> UpdateAsync(string id, UpdateBookingRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates the repair lifecycle status of a booking.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Status update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated booking, or null if not found.</returns>
    Task<BookingResponse?> UpdateStatusAsync(string id, UpdateBookingStatusRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Assigns a master technician or mechanic to a booking.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Assignment payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated booking, or null if not found.</returns>
    Task<BookingResponse?> AssignMechanicAsync(string id, AssignMechanicRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Cancels an active booking if it has not yet reached delivery/readiness.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="request">Cancellation payload.</param>
    /// <param name="authenticatedUserId">Authenticated user requesting cancellation.</param>
    /// <param name="isAdmin">Whether caller has administrator privileges.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Cancelled booking, or null if not found/cannot cancel.</returns>
    Task<BookingResponse?> CancelAsync(string id, CancelBookingRequest request, string? authenticatedUserId, bool isAdmin, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a booking record from the workshop directory.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="id">Booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>True if deleted, false if not found.</returns>
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}
