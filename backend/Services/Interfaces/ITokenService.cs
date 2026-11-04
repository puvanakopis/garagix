using Garagix.Api.Entities;

namespace Garagix.Api.Services.Interfaces;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user, bool rememberMe = false);
}

