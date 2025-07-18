﻿using System.Security.Claims;
using eCommerceApp.Domain.Entities.Identity;

namespace eCommerceApp.Domain.Interface.Authentication
{
    public interface IUserManagement
    {
        Task<bool> CreateUserAsync(AppUser user);
        Task<bool> LoginUserAsync(AppUser user);
        Task<AppUser?> GetUserByEmailAsync(string userEmail);
        Task<AppUser> GetUserByIdAsync(string id);
        Task<IEnumerable<AppUser>?> GetAllUsersAsync();
        Task<int> RemovUserByEmailAsync(string email);
        Task<List<Claim>> GetUserClaimsAsync(string email);
        Task<string> GenerateEmailConfirmationToken(AppUser user);
        Task<int> SendUserConfirmation(string email, string baseUrl);
        Task<bool> IsEmailConfirm(string userEmail);
        Task<bool> ConfirmUserForEmail(AppUser user, string token);
    }
}
