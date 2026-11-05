using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;

namespace Garagix.Api.Services.Interfaces;

/// <summary>
/// Service contract for handling public customer inquiries, advice requests, and triage dispatch.
/// </summary>
public interface IContactService
{
    /// <summary>
    /// Submits and persists a new customer contact inquiry.
    /// </summary>
    /// <param name="request">Contact inquiry payload.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Saved inquiry confirmation.</returns>
    Task<ContactInquiryResponse> SubmitInquiryAsync(CreateContactInquiryRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all submitted customer inquiries for administrator review.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of inquiries.</returns>
    Task<IReadOnlyList<ContactInquiryResponse>> GetAllInquiriesAsync(CancellationToken cancellationToken = default);
}
