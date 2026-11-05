using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for reading and managing workshop configuration and operating policies.
/// </summary>
public interface IWorkshopSettingsService
{
    /// <summary>
    /// Retrieves current garage workshop settings and operational limits.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Workshop configuration response object.</returns>
    Task<WorkshopSettingsResponse> GetSettingsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Modifies workshop settings, contact numbers, hours, and booking constraints.
    /// </summary>
    /// <param name="request">Update request containing modified attributes.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Updated workshop settings response object.</returns>
    Task<WorkshopSettingsResponse> UpdateSettingsAsync(UpdateWorkshopSettingsRequest request, CancellationToken cancellationToken = default);
}

