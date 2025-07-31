using eCommerceApp.Application.Mapping;
using eCommerceApp.Application.Services.Implimentation;
using eCommerceApp.Application.Services.Interface;
using eCommerceApp.Application.Services.Interface.Authentication;
using eCommerceApp.Application.Services.Interface.Cart;
using eCommerceApp.Application.Services.Interface.User;
using eCommerceApp.Application.Validations;
using eCommerceApp.Application.Validations.Authentications;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;

namespace eCommerceApp.Application.DependencyInjection
{
    public static class ServiceContainer
    {

        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingConfig));
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICategoryService, CategoryService>();

            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();
            services.AddScoped<IValidationService, ValidationService>();    
            services.AddScoped<IAuthenticationService, AuthenticationService>();    
            services.AddScoped<IPaymentMethodServices, PaymentMethodService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IUserService, UserService>();
            return services;
        }
    }
}
