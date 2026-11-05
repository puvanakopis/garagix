namespace Garagix.Api.Common.Utilities;

/// <summary>
/// Provides responsive HTML email layout templates for Garagix transactional notifications,
/// including registration verification OTPs, password reset codes, and customer welcomes.
/// </summary>
public static class EmailTemplateHelper
{
    /// <summary>
    /// Generates a branded HTML email template for new account registration OTP verification.
    /// </summary>
    /// <param name="name">Customer recipient name.</param>
    /// <param name="otpCode">The 6-digit numeric OTP code.</param>
    /// <param name="expiryMinutes">The expiration window in minutes (default 15).</param>
    /// <returns>HTML formatted email body string.</returns>
    public static string GetRegistrationOtpTemplate(string name, string otpCode, int expiryMinutes = 15)
    {
        return $"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0a0a; color: #ffffff; padding: 36px 24px; border-radius: 8px; max-width: 540px; margin: 0 auto; border: 1px solid #292929;">
            <div style="text-align: center; margin-bottom: 28px;">
                <h1 style="color: #d70006; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 3px;">GARAGIX</h1>
                <p style="color: #888888; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px;">Workshop &amp; Fleet Management</p>
            </div>
            <div style="background-color: #141313; border: 1px solid #222222; border-radius: 6px; padding: 24px;">
                <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Confirm Your Account Registration</h2>
                <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">Hello <strong style="color: #ffffff;">{name}</strong>,</p>
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for signing up with Garagix. To verify your email address and activate your customer account, please enter the 6-digit one-time password (OTP) below:
                </p>
                <div style="background: #1c1819; border: 1px solid #d70006; border-radius: 6px; padding: 18px; text-align: center; margin: 20px 0;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #d70006; display: inline-block; padding-left: 10px;">{otpCode}</span>
                </div>
                <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 16px 0 0 0;">
                    This verification code will expire in <strong style="color: #ffffff;">{expiryMinutes} minutes</strong>. If you did not request this registration, you can safely ignore this email.
                </p>
            </div>
            <hr style="border: 0; border-top: 1px solid #222222; margin: 28px 0 16px 0;" />
            <p style="color: #666666; font-size: 11px; text-align: center; margin: 0;">
                &copy; {DateTime.UtcNow.Year} Garagix Workshop Systems. All rights reserved.
            </p>
        </div>
        """;
    }

    /// <summary>
    /// Generates a branded HTML email template for password reset OTP requests.
    /// </summary>
    /// <param name="name">Customer recipient name.</param>
    /// <param name="otpCode">The 6-digit numeric OTP code.</param>
    /// <param name="expiryMinutes">The expiration window in minutes (default 15).</param>
    /// <returns>HTML formatted email body string.</returns>
    public static string GetPasswordResetOtpTemplate(string name, string otpCode, int expiryMinutes = 15)
    {
        return $"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0a0a; color: #ffffff; padding: 36px 24px; border-radius: 8px; max-width: 540px; margin: 0 auto; border: 1px solid #292929;">
            <div style="text-align: center; margin-bottom: 28px;">
                <h1 style="color: #d70006; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 3px;">GARAGIX</h1>
                <p style="color: #888888; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px;">Workshop &amp; Fleet Management</p>
            </div>
            <div style="background-color: #141313; border: 1px solid #222222; border-radius: 6px; padding: 24px;">
                <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Password Reset Request</h2>
                <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">Hello <strong style="color: #ffffff;">{name}</strong>,</p>
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
                    We received a request to reset the password for your Garagix account. Use the one-time verification code below:
                </p>
                <div style="background: #1c1819; border: 1px solid #d70006; border-radius: 6px; padding: 18px; text-align: center; margin: 20px 0;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #d70006; display: inline-block; padding-left: 10px;">{otpCode}</span>
                </div>
                <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; margin: 16px 0 0 0;">
                    This OTP will expire in <strong style="color: #ffffff;">{expiryMinutes} minutes</strong>. If you did not request this, you can safely ignore this email.
                </p>
            </div>
            <hr style="border: 0; border-top: 1px solid #222222; margin: 28px 0 16px 0;" />
            <p style="color: #666666; font-size: 11px; text-align: center; margin: 0;">
                &copy; {DateTime.UtcNow.Year} Garagix Workshop Systems. All rights reserved.
            </p>
        </div>
        """;
    }

    /// <summary>
    /// Generates a branded HTML email template welcoming newly activated customer accounts.
    /// </summary>
    /// <param name="name">Customer recipient name.</param>
    /// <returns>HTML formatted email body string.</returns>
    public static string GetWelcomeEmailTemplate(string name)
    {
        return $"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0a0a; color: #ffffff; padding: 36px 24px; border-radius: 8px; max-width: 540px; margin: 0 auto; border: 1px solid #292929;">
            <div style="text-align: center; margin-bottom: 28px;">
                <h1 style="color: #d70006; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 3px;">GARAGIX</h1>
                <p style="color: #888888; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px;">Workshop &amp; Fleet Management</p>
            </div>
            <div style="background-color: #141313; border: 1px solid #222222; border-radius: 6px; padding: 24px;">
                <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">Welcome to Garagix!</h2>
                <p style="color: #d1d5db; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">Hello <strong style="color: #ffffff;">{name}</strong>,</p>
                <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 16px 0;">
                    Your customer account has been created and verified successfully. You can now schedule vehicle repairs, monitor mechanic progress in real-time, and download service invoices directly from your portal.
                </p>
            </div>
            <hr style="border: 0; border-top: 1px solid #222222; margin: 28px 0 16px 0;" />
            <p style="color: #666666; font-size: 11px; text-align: center; margin: 0;">
                &copy; {DateTime.UtcNow.Year} Garagix Workshop Systems. All rights reserved.
            </p>
        </div>
        """;
    }
}
