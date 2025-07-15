using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Identity;

namespace eCommerceApp.Application.Services.Interface.Authentication
{
    public interface IAuthenticationService
    {
        Task<ServiceResponse> CreateUser(CreateUser user, string baseUrl);
        Task<LoginResponse> LoginUser(LoginUser user, string baseUrl);
        Task<LoginResponse> ReviveToken(string refreshToken);
        Task<bool> ConfirmUserForEmail(string userId, string token);
    }
}
