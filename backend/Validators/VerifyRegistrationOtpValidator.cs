using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Validator for confirming the registration OTP code.
/// </summary>
public class VerifyRegistrationOtpValidator : AbstractValidator<VerifyRegistrationOtpRequest>
{
    /// <summary>
    /// Initializes validation rules for verifying the registration OTP code.
    /// </summary>
    public VerifyRegistrationOtpValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("Please provide a valid email address.");

        RuleFor(x => x.Otp)
            .NotEmpty().WithMessage("Verification OTP code is required.")
            .Length(6).WithMessage("Verification code must be exactly 6 digits.")
            .Matches(@"^[0-9]{6}$").WithMessage("Verification code must consist of 6 numeric digits.");
    }
}

