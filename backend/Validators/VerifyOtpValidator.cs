using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

public class VerifyOtpValidator : AbstractValidator<VerifyOtpRequest>
{
    public VerifyOtpValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("Please enter a valid email address.");

        RuleFor(x => x.Otp)
            .NotEmpty().WithMessage("Verification code is required.")
            .Length(6).WithMessage("OTP verification code must be exactly 6 digits.")
            .Matches(@"^[0-9]{6}$").WithMessage("OTP verification code must be numeric.");
    }
}

