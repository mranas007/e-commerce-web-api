using System.Security.Claims;

namespace eCommerceApp.Domain.Interface.Authentication
{
    public interface ITokenManagement
    {
        string GetRefreshToken();
        List<Claim> GetUserClaimsFromToken(string token);
        Task<string> GetUserIdByRefreshTokenAsync(string refreshToken);
        Task<int> AddRefreshTokenAsync(string userId, string refreshToken);
        Task<int> UpdateRefreshTokenAsync(string userId, string refreshToken);
        string GenerateToken(List<Claim> claims);
        Task<bool> ValidateRefreshTokenAsync(string refreshToken);
    }
}
