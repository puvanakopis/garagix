using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="UpdateCustomerRequest"/>.
/// </summary>
public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerRequest>
{
    public UpdateCustomerValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Customer name cannot exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Phone)
            .MaximumLength(20).WithMessage("Phone number cannot exceed 20 characters.")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Address)
            .MaximumLength(250).WithMessage("Address cannot exceed 250 characters.")
            .When(x => !string.IsNullOrEmpty(x.Address));
    }
}

