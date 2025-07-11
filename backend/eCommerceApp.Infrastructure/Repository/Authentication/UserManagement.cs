using System.Security.Claims;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface.Authentication;
using eCommerceApp.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace eCommerceApp.Infrastructure.Repository.Authentication
{
    public class UserManagement(IRoleManagement roleManagement,
        UserManager<AppUser> userManager,
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
    }
}
