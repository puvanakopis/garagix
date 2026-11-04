namespace Garagix.Api.DTOs.Responses;

public class ForgotPasswordResponse
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public string? Otp { get; set; } // Provided in development for demo purposes
    public int ExpiresInMinutes { get; set; } = 15;
}

