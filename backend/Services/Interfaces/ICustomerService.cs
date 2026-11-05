using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for managing garage customers and their registered vehicle fleets.
/// </summary>
public interface ICustomerService
{
    /// <summary>
    /// Retrieves all customers matching optional status or search query filters.
    /// </summary>
    /// <param name="status">Optional status filter ('active', 'inactive').</param>
    /// <param name="search">Optional search query matching customer name, email, or telephone.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of customer response DTOs.</returns>
    Task<IReadOnlyList<CustomerResponse>> GetAllCustomersAsync(
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single customer profile including their vehicles.
    /// </summary>
    /// <param name="id">Customer user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Matching customer response DTO, or null if not found.</returns>
    Task<CustomerResponse?> GetCustomerByIdAsync(
        string id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new customer account.
    /// </summary>
    /// <param name="request">Customer creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Created customer response DTO.</returns>
    Task<CustomerResponse> CreateCustomerAsync(
        CreateCustomerRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing customer profile.
    /// </summary>
    /// <param name="id">Customer user identifier.</param>
    /// <param name="request">Update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated customer response DTO, or null if not found.</returns>
    Task<CustomerResponse?> UpdateCustomerAsync(
        string id,
        UpdateCustomerRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Toggles customer account active/inactive status.
    /// </summary>
    /// <param name="id">Customer user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated customer response DTO, or null if not found.</returns>
    Task<CustomerResponse?> ToggleCustomerStatusAsync(
        string id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a customer account.
    /// </summary>
    /// <param name="id">Customer user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>True if deleted, false if not found.</returns>
    Task<bool> DeleteCustomerAsync(
        string id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all vehicles registered under a specific customer.
    /// </summary>
    /// <param name="customerId">Customer user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of vehicle response DTOs.</returns>
    Task<IReadOnlyList<VehicleResponse>> GetCustomerVehiclesAsync(
        string customerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Adds a vehicle to a customer's registered fleet.
    /// </summary>
    /// <param name="customerId">Customer user identifier.</param>
    /// <param name="request">Vehicle creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Created vehicle response DTO.</returns>
    Task<VehicleResponse> AddVehicleAsync(
        string customerId,
        CreateVehicleRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a vehicle from a customer's fleet.
    /// </summary>
    /// <param name="customerId">Customer user identifier.</param>
    /// <param name="vehicleId">Vehicle identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>True if removed, false if not found.</returns>
    Task<bool> DeleteVehicleAsync(
        string customerId,
        string vehicleId,
        CancellationToken cancellationToken = default);
}

