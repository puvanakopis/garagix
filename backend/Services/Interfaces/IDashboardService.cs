using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Contract for compiling unified real-time dashboard analytics, operational metrics, and telemetry for workshop administrators and customers.
/// </summary>
public interface IDashboardService
{
    /// <summary>
    /// Compiles comprehensive operational telemetry, volume trends, category revenue breakdown, and today's appointments for workshop administrators.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Administrator dashboard response payload.</returns>
    Task<AdminDashboardResponse> GetAdminDashboardAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Compiles personalized vehicle fleet records, active repair telemetry, upcoming visits, and metric chips for a customer.
    /// </summary>
    /// <param name="customerId">Customer user identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Customer dashboard response payload or null if customer not found.</returns>
    Task<CustomerDashboardResponse?> GetCustomerDashboardAsync(string customerId, CancellationToken cancellationToken = default);
}

