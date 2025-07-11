using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface.Authentication;
using Microsoft.AspNetCore.Identity;

namespace eCommerceApp.Infrastructure.Repository.Authentication
{
    public class RoleManagement(UserManager<AppUser> userManager) : IRoleManagement
    {
        public async Task<bool> AdUserToRoleAsync(AppUser user, string roleName)
        {
            return (await userManager.AddToRoleAsync(user, roleName)).Succeeded;
        }

        public async Task<string?> GetUserRoleAsync(string userEmail)
        {
            var user = await userManager.FindByEmailAsync(userEmail);
            if (user is null)
                return null;
            return (await userManager.GetRolesAsync(user)).FirstOrDefault();
        }
    }
}
