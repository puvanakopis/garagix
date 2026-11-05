using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Garagix.Api.Entities;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Service responsible for issuing signed JSON Web Tokens (JWT) for authenticated users.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="TokenService"/> class using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="configuration">Application configuration for retrieving JWT settings.</param>
public class TokenService(IConfiguration configuration) : ITokenService
{
    private readonly IConfiguration _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

    /// <inheritdoc />
    public (string Token, DateTime ExpiresAt) GenerateToken(User user, bool rememberMe = false)
    {
        ArgumentNullException.ThrowIfNull(user);

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
