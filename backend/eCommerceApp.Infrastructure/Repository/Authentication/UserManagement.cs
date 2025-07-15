using System;
using System.Security.Claims;
using Azure.Core;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface.Authentication;
using eCommerceApp.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace eCommerceApp.Infrastructure.Repository.Authentication
{
    public class UserManagement(IRoleManagement roleManagement,
        UserManager<AppUser> userManager,
        IEmailSender emailSender,
        AppDbContext context) : IUserManagement
    {

        public async Task<bool> CreateUserAsync(AppUser user)
        {
            var _user = await GetUserByEmailAsync(user.Email!);
            if (_user is not null) return false;

            return (await userManager.CreateAsync(user!, user.PasswordHash!)).Succeeded;
        }

        public async Task<IEnumerable<AppUser>?> GetAllUsersAsync() => await context.Users.ToListAsync();

        public async Task<AppUser?> GetUserByEmailAsync(string userEmail) =>
            await userManager.FindByEmailAsync(userEmail);

        public async Task<AppUser> GetUserByIdAsync(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            return user!;
        }

        public async Task<List<Claim>> GetUserClaimsAsync(string email)
        {
            var user = await GetUserByEmailAsync(email);
            string? roleName = await roleManagement.GetUserRoleAsync(user!.Email!);

            List<Claim> claims = [
                new Claim("Fullname", user!.Fullname!),
                new Claim(ClaimTypes.NameIdentifier, user!.Id!),
                new Claim(ClaimTypes.Email, user!.Email!),
                new Claim(ClaimTypes.Role, roleName!),
            ];

            return claims;
        }

        public async Task<bool> LoginUserAsync(AppUser user)
        {
            // Fetch the user by email  
            var _user = await GetUserByEmailAsync(user!.Email!);

            // Check if the user exists  
            if (_user == null) return false;

            // Fetch the user's role  
            string? roleName = await roleManagement.GetUserRoleAsync(_user.Email!);

            // Check if the role is valid  
            if (string.IsNullOrEmpty(roleName)) return false;

            // Validate the password  
            bool isPasswordValid = await userManager.CheckPasswordAsync(_user, user.PasswordHash!);
            if (!isPasswordValid) return false;
            return true;
        }

        public async Task<int> RemovUserByEmailAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(_ => _.Email == email);
            if (user is null) return 0;
            context.Users.Remove(user);
            return await context.SaveChangesAsync();
        }

        public async Task<string> GenerateEmailConfirmationToken(AppUser user)
        {
            return await userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<int> SendUserConfirmation(string email, string baseUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(baseUrl))
                    return -1; // Invalid input

                var user = await userManager.FindByEmailAsync(email);
                if (user is null)
                    return 0;

                var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = $"{baseUrl}/confirm-email?Id={user.Id}&token={Uri.EscapeDataString(token)}";

                var subject = "Welcome to Dig Store! Confirm Your Email Address";
                var message = $@"
                    <div style='font-family:Segoe UI,Roboto,Arial,sans-serif;background:#f6f8fa;padding:40px 0;'>
                        <div style='max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.07);padding:32px 28px;'>
                            <div style='text-align:center;'>
                                <img src='https://digstore.com/assets/logo.png' alt='Dig Store' style='width:64px;height:64px;margin-bottom:16px;'/>
                                <h2 style='color:#222;font-weight:700;margin-bottom:8px;'>Confirm your email address</h2>
                                <p style='color:#555;font-size:16px;margin-bottom:24px;'>
                                    Thanks for joining <b>Dig Store</b>! To get started, please confirm your email address by clicking the button below.
                                </p>
                                <a href='{confirmationLink}' style='display:inline-block;padding:14px 32px;background:#4f46e5;color:#fff;font-size:16px;font-weight:600;border-radius:8px;text-decoration:none;box-shadow:0 2px 8px rgba(79,70,229,0.12);transition:background 0.2s;'>Confirm Email</a>
                                <p style='color:#888;font-size:13px;margin-top:32px;'>
                                    If you did not create an account with Dig Store, you can safely ignore this email.
                                </p>
                                <hr style='border:none;border-top:1px solid #eee;margin:32px 0;'/>
                                <p style='color:#aaa;font-size:12px;'>
                                    &copy; {DateTime.UtcNow.Year} Dig Store. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                ";

                await emailSender.SendEmailAsync(user.Email!, subject, message);
                return 1;
            }
            catch (System.Exception er)
            {
                return -1; // Indicating an error occurred
            }
        }

        public async Task<bool> IsEmailConfirm(string userEmail)
        {
            AppUser? user = await userManager.FindByEmailAsync(userEmail);
            if (user!.EmailConfirmed)
                return true;
            else
                return false;
        }

        public async Task<bool> ConfirmUserForEmail(AppUser user, string token)
        {
            await userManager.ConfirmEmailAsync(user, token);
            return true;
        }
    }
}
