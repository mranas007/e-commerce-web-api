using eCommerceApp.Domain.Entities.Identity;

namespace eCommerceApp.Domain.Interface.Authentication
{
    public interface IRoleManagement
    {
        Task<string?> GetUserRoleAsync(string userEmail);
        Task<bool> AdUserToRoleAsync(AppUser user, string roleName);
    }
}
