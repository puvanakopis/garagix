namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Data transfer object for updating authenticated user profile details.
/// </summary>
public class UpdateProfileRequest
{
    /// <summary>
    /// Gets or sets the full legal or display name.
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets primary telephone number.
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Gets or sets physical or residential address.
    /// </summary>
    public string? Address { get; set; }
}

