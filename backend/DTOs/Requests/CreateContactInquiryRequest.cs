namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for submitting a public contact inquiry or service consultation request.
/// </summary>
public class CreateContactInquiryRequest
{
    /// <summary>
    /// Gets or sets customer first name.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer last name.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets customer telephone number.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets automotive service category requested.
    /// </summary>
    public string ServiceType { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets vehicle details and inquiry message.
    /// </summary>
    public string Message { get; set; } = string.Empty;
}
