namespace Garagix.Api.DTOs.Requests;

/// <summary>
/// Payload submitted to update an existing customer profile.
/// </summary>
public class UpdateCustomerRequest
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Status { get; set; }
    public int? TotalBookings { get; set; }
}

