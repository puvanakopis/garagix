using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime ExpiresAt) GenerateToken(User user, bool rememberMe = false)
    {
        var keyString = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? Environment.GetEnvironmentVariable("JWT_KEY")
            ?? _configuration["Jwt:Key"] 
            ?? "GaragixSecretSuperSecureJsonWebTokenKey2026!#*";
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") 
            ?? _configuration["Jwt:Issuer"] 
            ?? "GaragixApi";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") 
            ?? _configuration["Jwt:Audience"] 
            ?? "GaragixFrontend";
        var expiryHours = rememberMe ? 24 * 7 : 24; // 7 days if rememberMe, else 24 hours

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddHours(expiryHours);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Role, user.Role),
            new("phone", user.Phone),
            new("status", user.Status)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(securityToken);

        return (token, expiresAt);
    }
}
