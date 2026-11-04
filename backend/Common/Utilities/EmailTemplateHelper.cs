namespace Garagix.Api.Common.Utilities;

public static class EmailTemplateHelper
{
    public static string GetPasswordResetOtpTemplate(string name, string otpCode, int expiryMinutes = 15)
    {
        return $@"
        <div style=""font-family: Arial, sans-serif; background-color: #0b0a0a; color: #ffffff; padding: 30px; border-radius: 8px; max-width: 520px; margin: 0 auto; border: 1px solid #292929;"">
            <div style=""text-align: center; margin-bottom: 24px;"">
                <h1 style=""color: #d70006; margin: 0; font-size: 24px; letter-spacing: 2px;"">GARAGIX</h1>
                <p style=""color: #888888; font-size: 12px; margin-top: 4px; text-transform: uppercase;"">Workshop & Fleet Management</p>
            </div>
            <h2 style=""color: #ffffff; font-size: 18px; margin-bottom: 12px;"">Password Reset Request</h2>
            <p style=""color: #cccccc; font-size: 14px; line-height: 1.5;"">Hello {name},</p>
            <p style=""color: #cccccc; font-size: 14px; line-height: 1.5;"">We received a request to reset the password for your Garagix account. Use the one-time verification code below:</p>
            <div style=""background: #171415; border: 1px solid #d70006; border-radius: 6px; padding: 18px; text-align: center; margin: 24px 0;"">
                <span style=""font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #d70006;"">{otpCode}</span>
            </div>
            <p style=""color: #999999; font-size: 12px;"">This OTP will expire in <strong>{expiryMinutes} minutes</strong>. If you did not request this, you can safely ignore this email.</p>
            <hr style=""border: 0; border-top: 1px solid #222222; margin: 24px 0;"" />
            <p style=""color: #666666; font-size: 11px; text-align: center;"">&copy; {DateTime.UtcNow.Year} Garagix Workshop Systems. All rights reserved.</p>
        </div>";
    }

    public static string GetWelcomeEmailTemplate(string name)
    {
        return $@"
        <div style=""font-family: Arial, sans-serif; background-color: #0b0a0a; color: #ffffff; padding: 30px; border-radius: 8px; max-width: 520px; margin: 0 auto; border: 1px solid #292929;"">
            <div style=""text-align: center; margin-bottom: 24px;"">
                <h1 style=""color: #d70006; margin: 0; font-size: 24px; letter-spacing: 2px;"">GARAGIX</h1>
                <p style=""color: #888888; font-size: 12px; margin-top: 4px; text-transform: uppercase;"">Workshop & Fleet Management</p>
            </div>
            <h2 style=""color: #ffffff; font-size: 18px; margin-bottom: 12px;"">Welcome to Garagix!</h2>
            <p style=""color: #cccccc; font-size: 14px; line-height: 1.5;"">Hello {name},</p>
            <p style=""color: #cccccc; font-size: 14px; line-height: 1.5;"">Your customer account has been created successfully. You can now schedule vehicle repairs, monitor mechanic progress in real-time, and download service invoices from your portal.</p>
            <hr style=""border: 0; border-top: 1px solid #222222; margin: 24px 0;"" />
            <p style=""color: #666666; font-size: 11px; text-align: center;"">&copy; {DateTime.UtcNow.Year} Garagix Workshop Systems. All rights reserved.</p>
        </div>";
    }
}

