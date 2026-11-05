namespace Garagix.Api.Common.Utilities;

/// <summary>
/// Provides cryptographic hashing and verification for user passwords using BCrypt.
/// </summary>
public static class PasswordHelper
{
    /// <summary>
    /// Generates a salted BCrypt password hash.
    /// </summary>
    /// <param name="password">Plain text password.</param>
    /// <returns>Cryptographic hash string.</returns>
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
    }

    /// <summary>
    /// Verifies that a plain text password matches the cryptographic BCrypt hash.
    /// </summary>
    /// <param name="password">Plain text password attempt.</param>
    /// <param name="hash">Stored BCrypt password hash.</param>
    /// <returns><c>true</c> if verified; otherwise, <c>false</c>.</returns>
    public static bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hash))
        {
            return false;
        }

        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch
        {
            return false;
        }
    }
}
