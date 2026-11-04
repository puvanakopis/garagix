using Garagix.Api.Services.Interfaces;

namespace Garagix.Api.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        // Log out the dispatch cleanly for local development and debugging
        _logger.LogInformation("================== OUTGOING EMAIL ==================");
        _logger.LogInformation("To: {ToEmail}", toEmail);
        _logger.LogInformation("Subject: {Subject}", subject);
        _logger.LogInformation("Content length: {Length} characters", htmlBody.Length);
        _logger.LogInformation("====================================================");

        return Task.CompletedTask;
    }
}

