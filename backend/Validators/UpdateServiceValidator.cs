using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="UpdateServiceRequest"/>.
/// </summary>
public class UpdateServiceValidator : AbstractValidator<UpdateServiceRequest>
{
    public UpdateServiceValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Service name is required.")
            .MaximumLength(150).WithMessage("Service name cannot exceed 150 characters.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Service category is required.")
            .MaximumLength(50).WithMessage("Category cannot exceed 50 characters.");

        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage("Short description is required.")
            .MaximumLength(500).WithMessage("Short description cannot exceed 500 characters.");

        RuleFor(x => x.StartingPriceLkr)
            .GreaterThanOrEqualTo(0).WithMessage("Starting price must be non-negative.");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Duration must be greater than 0 minutes.");
    }
}

