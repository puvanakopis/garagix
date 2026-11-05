namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted to create a new garage customer.
/// </summary>
public class CreateCustomerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Password { get; set; }
    public string? Status { get; set; } = "active";
}

