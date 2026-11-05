using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for managing vehicle repair packages in the Garagix Service Catalog.
/// </summary>
public interface IServiceCatalogService
{
    /// <summary>
    /// Retrieves a list of services matching the optional filter criteria.
    /// </summary>
    /// <param name="activeOnly">Optional filter to return only active packages.</param>
    /// <param name="category">Optional category filter.</param>
    /// <param name="search">Optional text search across name, category, and description.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of service package response DTOs.</returns>
    Task<IReadOnlyList<ServiceResponse>> GetAllAsync(
        bool? activeOnly = null,
        string? category = null,
        string? search = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single service package by either its primary identifier or URL slug.
    /// </summary>
    /// <param name="idOrSlug">The unique ID (e.g. 'srv-1') or URL slug.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The matching service response DTO, or null if not found.</returns>
    Task<ServiceResponse?> GetByIdOrSlugAsync(
        string idOrSlug,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new service package in the catalog. Restricted to administrators.
    /// </summary>
    /// <param name="request">Service creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The created service package with assigned identifier.</returns>
    Task<ServiceResponse> CreateAsync(
        CreateServiceRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing service package. Restricted to administrators.
    /// </summary>
    /// <param name="id">The unique identifier of the service to modify.</param>
    /// <param name="request">Updated fields.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The updated service package, or null if not found.</returns>
    Task<ServiceResponse?> UpdateAsync(
        string id,
        UpdateServiceRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a service package from the catalog. Restricted to administrators.
    /// </summary>
    /// <param name="id">The unique identifier of the service to remove.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>True if deleted successfully, false if the record was not found.</returns>
    Task<bool> DeleteAsync(
        string id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the distinct list of active service categories.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of category names.</returns>
    Task<IReadOnlyList<string>> GetCategoriesAsync(
        CancellationToken cancellationToken = default);
}

