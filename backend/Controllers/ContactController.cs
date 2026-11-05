using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Garagix.Api.DTOs.Requests;
using Garagix.Api.DTOs.Responses;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Controllers;

/// <summary>
/// Controller for processing public customer inquiries, triage communication, and reception logs.
/// </summary>
/// <remarks>
/// Initializes a new instance of <see cref="ContactController"/> using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="contactService">Contact business logic service.</param>
/// <param name="logger">Application logger.</param>
[ApiController]
[Route("api/[controller]")]
public class ContactController(
    IContactService contactService,
    ILogger<ContactController> logger) : ControllerBase
{
    private readonly IContactService _contactService = contactService ?? throw new ArgumentNullException(nameof(contactService));
    private readonly ILogger<ContactController> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    /// <summary>
    /// Submits a new vehicle service inquiry or repair consultation message from the public website.
    /// Publicly accessible without authentication.
    /// </summary>
    /// <param name="request">Contact inquiry details.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Confirmation details of the submitted inquiry.</returns>
    /// <response code="201">Inquiry received successfully.</response>
    /// <response code="400">Validation failure.</response>
    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ContactInquiryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ContactInquiryResponse>> Submit(
        [FromBody] CreateContactInquiryRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
        {
            return BadRequest(new { message = "First name and last name are required." });
        }

        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
        {
            return BadRequest(new { message = "A valid email address is required." });
        }

        if (string.IsNullOrWhiteSpace(request.Phone))
        {
            return BadRequest(new { message = "Contact phone number is required." });
        }

        var result = await _contactService.SubmitInquiryAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>
    /// Retrieves all customer inquiries submitted to the workshop reception.
    /// Restricted to administrators.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>List of inquiries.</returns>
    /// <response code="200">List of customer inquiries.</response>
    /// <response code="401">Unauthorized.</response>
    /// <response code="403">Forbidden.</response>
    [HttpGet]
    [Authorize(Roles = "admin,Admin")]
    [ProducesResponseType(typeof(IReadOnlyList<ContactInquiryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IReadOnlyList<ContactInquiryResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _contactService.GetAllInquiriesAsync(cancellationToken);
        return Ok(list);
    }
}
