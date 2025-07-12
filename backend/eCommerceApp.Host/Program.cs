using eCommerceApp.Infrastructure.DependencyInjection;
using eCommerceApp.Application.DependencyInjection;
using Serilog;
using eCommerceApp.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    //.WriteTo.File("log/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
Log.Information("Application is starting......");

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure HTTP/2 settings to avoid protocol errors
builder.Services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
{
    options.ConfigureEndpointDefaults(lo =>
    {
        lo.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1AndHttp2;
    });
});

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

// The CORS configuration here is incorrect because .AllowAnyOrigin() cannot be used together with .AllowCredentials().
// According to ASP.NET Core, if you call .AllowCredentials(), you must specify explicit origins using .WithOrigins().
// Here's the corrected version:

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              //.AllowAnyOrigin() 
              .WithOrigins("http://localhost:5173")
              .AllowCredentials();
    });
});

try
{

    var app = builder.Build();
    
    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // Correct middleware order
    app.UseHttpsRedirection();
    app.UseCors();
    app.UseSerilogRequestLogging();
    
    // Authentication and Authorization must come before routing
    app.UseAuthentication();
    app.UseAuthorization();
    
    app.UseInfrastructureServices();

    app.MapControllers();

    // Admin registration - moved to after app build
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var userManager = services.GetRequiredService<UserManager<AppUser>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            // Ensure the Admin role exists
            var adminRoleExists = await roleManager.RoleExistsAsync("Admin");
            if (!adminRoleExists)
            {
                var roleResult = await roleManager.CreateAsync(new IdentityRole("Admin"));
                if (!roleResult.Succeeded)
                {
                    Log.Error("Failed to create Admin role: {Errors}", string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                }
            }

            // Check if admin user exists
            var adminUser = await userManager.FindByEmailAsync("admin@admin.com");
            if (adminUser == null)
            {
                var admin = new AppUser
                {
                    UserName = "admin",
                    Email = "admin@admin.com"
                };
                
                var result = await userManager.CreateAsync(admin, "Admin@123"); // Use a secure password in production
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                    Log.Information("Admin user created: admin@admin.com / Admin@123");
                }
                else
                {
                    Log.Error("Failed to create admin user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                Log.Information("Admin user already exists.");
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error occurred while ensuring admin user exists.");
        }
    }
    Log.Information("Application is running......");
    app.Run();
}
catch (Exception ex)
{
    Log.Logger.Error(ex, "Application failed to start......");
}
finally
{
    Log.CloseAndFlush();
}