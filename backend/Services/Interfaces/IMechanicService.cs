using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for managing workshop technicians and mechanics in Garagix.
/// </summary>
public interface IMechanicService
{
    /// <summary>
    /// Retrieves all technicians matching the optional status or keyword filter.
    /// </summary>
    /// <param name="status">Optional status filter ('available', 'busy', 'on_leave').</param>
    /// <param name="search">Optional search query matching name, title, or specialization.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Collection of technician response DTOs.</returns>
    Task<IReadOnlyList<MechanicResponse>> GetAllAsync(
        string? status = null,
        string? search = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a single technician by identifier.
    /// </summary>
    /// <param name="id">Technician identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Matching technician response DTO, or null if not found.</returns>
    Task<MechanicResponse?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new technician profile.
    /// </summary>
    /// <param name="request">Creation payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Created technician response DTO.</returns>
    Task<MechanicResponse> CreateAsync(
        CreateMechanicRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing technician profile.
    /// </summary>
    /// <param name="id">Technician identifier.</param>
    /// <param name="request">Update payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated technician response DTO, or null if not found.</returns>
    Task<MechanicResponse?> UpdateAsync(
        string id,
        UpdateMechanicRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a technician from the active workshop roster.
    /// </summary>
    /// <param name="id">Technician identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>True if deleted, false if not found.</returns>
    Task<bool> DeleteAsync(
        string id,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates live availability status of a technician.
    /// </summary>
    /// <param name="id">Technician identifier.</param>
    /// <param name="status">New availability status ('available', 'busy', 'on_leave').</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated technician response DTO, or null if not found.</returns>
    Task<MechanicResponse?> UpdateStatusAsync(
        string id,
        string status,
        CancellationToken cancellationToken = default);
}

