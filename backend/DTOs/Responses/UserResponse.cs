namespace Garagix.Api.DTOs.Responses;

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string Role { get; set; } = "customer";
    public DateTime CreatedAt { get; set; }
    public int TotalBookings { get; set; } = 0;
    public string Status { get; set; } = "active";
}

