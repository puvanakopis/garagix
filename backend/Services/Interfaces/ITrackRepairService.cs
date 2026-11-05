using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service interface for querying vehicle repair telemetry, workshop milestones, and live customer bay tracking.
/// </summary>
public interface ITrackRepairService
{
    /// <summary>
    /// Retrieves live repair telemetry and computed milestones for a booking by reference code or vehicle license plate.
    /// </summary>
    /// <param name="referenceOrPlate">Booking reference (e.g. 'GRX-2026-8941') or vehicle license plate.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Comprehensive telemetry response or null if not found.</returns>
    Task<TrackRepairResponse?> GetTelemetryAsync(string referenceOrPlate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves active workshop jobs for quick-switching in the telemetry dashboard.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of active feed summaries.</returns>
    Task<IReadOnlyList<TrackFeedSummaryDto>> GetActiveFeedsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves active and recent repair jobs for a specific customer.
    /// </summary>
    /// <param name="customerId">Customer identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of customer repair summaries.</returns>
    Task<IReadOnlyList<TrackFeedSummaryDto>> GetCustomerFeedsAsync(string customerId, CancellationToken cancellationToken = default);
}

