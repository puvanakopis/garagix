using Microsoft.EntityFrameworkCore;

namespace Garagix.Api.Data;

/// <summary>
/// Provides startup initialization utilities to guarantee MySQL schema and table readiness.
/// </summary>
public static class DbInitializer
{
    /// <summary>
    /// Ensures database existence and executes schema migrations or table creation scripts.
    /// </summary>
    /// <param name="context">The database context instance.</param>
    /// <param name="logger">Logger for recording database provisioning activity.</param>
    public static async Task InitializeAsync(ApplicationDbContext context, ILogger logger)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(logger);

        try
        {
            await context.Database.EnsureCreatedAsync();

            // Explicitly ensure the pending_registrations table exists even if database was previously provisioned
            const string createPendingRegistrationsTableSql = """
                CREATE TABLE IF NOT EXISTS `pending_registrations` (
                    `Id` VARCHAR(50) NOT NULL PRIMARY KEY,
                    `FullName` VARCHAR(100) NOT NULL,
                    `Email` VARCHAR(150) NOT NULL,
                    `Phone` VARCHAR(20) NOT NULL,
                    `Address` VARCHAR(250) NULL,
                    `PasswordHash` VARCHAR(255) NOT NULL,
                    `Role` VARCHAR(20) NOT NULL DEFAULT 'customer',
                    `Otp` VARCHAR(10) NOT NULL,
                    `OtpExpiry` DATETIME(6) NOT NULL,
                    `CreatedAt` DATETIME(6) NOT NULL,
                    INDEX `IX_pending_registrations_Email` (`Email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                """;

            await context.Database.ExecuteSqlRawAsync(createPendingRegistrationsTableSql);
            logger.LogInformation("Database schema initialized and pending_registrations table verified.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "DbInitializer: Could not verify MySQL tables on startup. Ensure MySQL service is running.");
        }
    }
}

