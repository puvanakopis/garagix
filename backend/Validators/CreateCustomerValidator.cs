using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="CreateCustomerRequest"/>.
/// </summary>
public class CreateCustomerValidator : AbstractValidator<CreateCustomerRequest>
{
    public CreateCustomerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Customer name is required.")
            .MaximumLength(100).WithMessage("Customer name cannot exceed 100 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone number is required.")
            .MaximumLength(20).WithMessage("Phone number cannot exceed 20 characters.");

        RuleFor(x => x.Address)
            .MaximumLength(250).WithMessage("Address cannot exceed 250 characters.")
            .When(x => !string.IsNullOrEmpty(x.Address));
    }
}

