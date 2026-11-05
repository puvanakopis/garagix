using FluentValidation;
using Garagix.Api.DTOs.Requests;

namespace Garagix.Api.Validators;

/// <summary>
/// Fluent validation rules for <see cref="CreateMechanicRequest"/>.
/// </summary>
public class CreateMechanicValidator : AbstractValidator<CreateMechanicRequest>
{
    public CreateMechanicValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Technician name is required.")
            .MaximumLength(120).WithMessage("Name cannot exceed 120 characters.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Job title is required.")
            .MaximumLength(150).WithMessage("Job title cannot exceed 150 characters.");

        RuleFor(x => x.Specialization)
            .NotEmpty().WithMessage("Specialization discipline is required.")
            .MaximumLength(200).WithMessage("Specialization cannot exceed 200 characters.");

        RuleFor(x => x.ExperienceYears)
            .GreaterThanOrEqualTo(0).WithMessage("Experience years must be 0 or greater.");
    }
}

