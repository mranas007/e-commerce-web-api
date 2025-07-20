using System.Text;
using eCommerceApp.Application.Services.Interface.Cart;
using eCommerceApp.Application.Services.Interface.Logging;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface;
using eCommerceApp.Domain.Interface.Authentication;
using eCommerceApp.Domain.Interface.Cart;
using eCommerceApp.Domain.Interface.Product;
using eCommerceApp.Infrastructure.Data;
using eCommerceApp.Infrastructure.Middleware;
using eCommerceApp.Infrastructure.Repository;
using eCommerceApp.Infrastructure.Repository.Authentication;
using eCommerceApp.Infrastructure.Repository.Cart;
using eCommerceApp.Infrastructure.Repository.Product;
using eCommerceApp.Infrastructure.Services;
using eCommerceApp.Infrastructure.Services.Email;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace eCommerceApp.Infrastructure.DependencyInjection
{
    public static class ServiceContainer
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // cotnext setup
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                SqlOptions =>
                {
                    SqlOptions.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName);
                    SqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null);
                }
            ), ServiceLifetime.Scoped);

            services.AddScoped<IGeneric<Product>, GenericRepository<Product>>();
            services.AddScoped<IGeneric<Category>, GenericRepository<Category>>();
            services.AddScoped(typeof(IAppLogger<>), typeof(SerilogLoggerAdapter<>));

            // identity setup
            services.AddDefaultIdentity<AppUser>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
                options.Tokens.EmailConfirmationTokenProvider = TokenOptions.DefaultEmailProvider;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();

            // JWT authentication setup
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
              {
                  options.SaveToken = true;
                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateAudience = true,
                      ValidateIssuer = true,
                      ValidateLifetime = true,
                      RequireExpirationTime = true,
                      ValidateIssuerSigningKey = true,
                      ValidIssuer = configuration["Jwt:Issuer"],
                      ValidAudience = configuration["Jwt:Audience"],
                      ClockSkew = TimeSpan.Zero, // Disable clock skew for testing purposes
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)),
                  };
              });

            services.AddScoped<IUserManagement, UserManagement>();
            services.AddScoped<ITokenManagement, TokenManagement>();
            services.AddScoped<IRoleManagement, RoleManagement>();
            services.AddScoped<IPaymentMethod, PaymentMethodRepository>();
            services.AddScoped<IPaymentService, StripePaymentService>();
            services.AddScoped<ICart, CartRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<IProductImagesRepository, ProductImagesRepository>();

            Stripe.StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
            return services;
        }

        public static IApplicationBuilder UseInfrastructureServices(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            return app;
        }
    }
}
