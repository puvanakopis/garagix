using System.Net;
using System.Net.Mail;
using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

/// <summary>
/// Service providing transactional email dispatching for notifications, registration verification codes,
/// password recovery OTPs, and welcome messages using SMTP.
/// </summary>
/// <remarks>
/// Initializes a new instance of the <see cref="EmailService"/> class using C# 12 primary constructor syntax.
/// </remarks>
/// <param name="logger">Structured logger instance.</param>
/// <param name="configuration">Application configuration for optional SMTP connection settings.</param>
public class EmailService(ILogger<EmailService> logger, IConfiguration configuration) : IEmailService
{
    private readonly ILogger<EmailService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    private readonly IConfiguration _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

    /// <inheritdoc />
    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(toEmail);
        ArgumentException.ThrowIfNullOrWhiteSpace(subject);

        // Support both SMTP_* and MAIL_* environment variable naming conventions
        var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST")
            ?? Environment.GetEnvironmentVariable("MAIL_HOST")
            ?? _configuration["Smtp:Host"]
            ?? _configuration["Mail:Host"];

        if (string.IsNullOrWhiteSpace(smtpHost))
        {
            _logger.LogWarning("SMTP host not configured (SMTP_HOST / MAIL_HOST). Email skipped.");
            return;
        }

        var smtpPortStr = Environment.GetEnvironmentVariable("SMTP_PORT")
            ?? Environment.GetEnvironmentVariable("MAIL_PORT")
            ?? _configuration["Smtp:Port"]
            ?? _configuration["Mail:Port"]
            ?? "587";

        _ = int.TryParse(smtpPortStr, out var smtpPort);
        if (smtpPort <= 0) smtpPort = 587;

        var smtpUser = Environment.GetEnvironmentVariable("SMTP_USER")
            ?? Environment.GetEnvironmentVariable("SMTP_USERNAME")
            ?? Environment.GetEnvironmentVariable("MAIL_USERNAME")
            ?? Environment.GetEnvironmentVariable("MAIL_USER")
            ?? _configuration["Smtp:User"]
            ?? _configuration["Mail:Username"];

        var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASSWORD")
            ?? Environment.GetEnvironmentVariable("SMTP_PASS")
            ?? Environment.GetEnvironmentVariable("MAIL_PASSWORD")
            ?? _configuration["Smtp:Password"]
            ?? _configuration["Mail:Password"];

        var smtpFrom = Environment.GetEnvironmentVariable("SMTP_FROM")
            ?? Environment.GetEnvironmentVariable("MAIL_FROM")
            ?? _configuration["Smtp:From"]
            ?? _configuration["Mail:From"]
            ?? smtpUser
            ?? "no-reply@garagix.lk";

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(smtpFrom, "Garagix Workshop"),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = smtpPort != 25,
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 15000
            };

            if (!string.IsNullOrWhiteSpace(smtpUser) && !string.IsNullOrWhiteSpace(smtpPass))
            {
                client.Credentials = new NetworkCredential(smtpUser.Trim(), smtpPass.Trim());
            }

            await client.SendMailAsync(message, cancellationToken);

            lock (Console.Out)
            {
                Console.ForegroundColor = ConsoleColor.Magenta;
                Console.WriteLine($"         -> Email sent to {toEmail} via SMTP ({smtpHost}:{smtpPort})");
                Console.ResetColor();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to dispatch email via SMTP ({Host}:{Port}) to {ToEmail}", smtpHost, smtpPort, toEmail);
            throw new InvalidOperationException($"Unable to send verification email: {ex.Message}. Please check SMTP configuration or try again.", ex);
        }
    }
}
