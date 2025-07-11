using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.Validations.Authentications;
using FluentValidation;

namespace eCommerceApp.Application.Validations
{
    public interface IValidationService
    {
        Task<ServiceResponse> ValidateAsync<T>(T model, IValidator<T> validator);
    }
}
