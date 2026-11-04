namespace Garagix.Api.DTOs.Responses;

public class AuthResponse
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
    public UserResponse? User { get; set; }
}

