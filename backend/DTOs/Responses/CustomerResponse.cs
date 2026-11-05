namespace Garagix.Api.DTOs.Responses;

/// <summary>
/// Customer account data transfer object returned to client callers.
/// </summary>
public class CustomerResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string Role { get; set; } = "customer";
    public int TotalBookings { get; set; }
    public string Status { get; set; } = "active";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<VehicleResponse> Vehicles { get; set; } = [];
}

