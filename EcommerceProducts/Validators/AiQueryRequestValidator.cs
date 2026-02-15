using FluentValidation;
using EcommerceProducts.DTOs;

namespace EcommerceProducts.Validators;

public class AiQueryRequestValidator : AbstractValidator<AiQueryRequest>
{
    public AiQueryRequestValidator()
    {
        RuleFor(x => x.Question)
            .NotEmpty().WithMessage("The field 'question' is required.")
            .MaximumLength(500).WithMessage("The field 'question' cannot exceed 500 characters.");
    }
}
