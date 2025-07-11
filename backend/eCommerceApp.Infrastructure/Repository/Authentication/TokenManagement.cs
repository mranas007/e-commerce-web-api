using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface.Authentication;
using eCommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace eCommerceApp.Infrastructure.Repository.Authentication
{
    public class TokenManagement(AppDbContext context, IConfiguration config) : ITokenManagement
    {
        public async Task<int> AddRefreshTokenAsync(string userId, string refreshToken)
        {
            context.RefreshTokens.Add(new RefreshToken
            {
                UserId = userId,
                Token = refreshToken
            });

            return await context.SaveChangesAsync();
        }

        public string GenerateToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]!));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddHours(2);
            var token = new JwtSecurityToken(
                issuer: config["JWT:Issuer"],
                audience: config["JWT:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: cred);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GetRefreshToken()
        {
            const int byteSize = 64;
            byte[] bytes = new byte[byteSize];
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(bytes);
            }

            string token = Convert.ToBase64String(bytes);
            return WebUtility.UrlEncode(token);
        }

        public List<Claim> GetUserClaimsFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            if (jwtToken is not null)
                return jwtToken.Claims.ToList();
            else
                return [];
        }

        public async Task<string> GetUserIdByRefreshTokenAsync(string refreshToken)
        {
           return (await context.RefreshTokens.FirstOrDefaultAsync(_ => _.Token == refreshToken))!.UserId;
        }

        public async Task<int> UpdateRefreshTokenAsync(string userId, string refreshToken)
        {
            var user = await context.RefreshTokens.FirstOrDefaultAsync(_ => _.UserId == userId);
            if (user is null) return -1;
            user.Token = refreshToken;
            return await context.SaveChangesAsync();
        }

        public async Task<bool> ValidateRefreshTokenAsync(string refreshToken)
        {
            var user = await context.RefreshTokens.FirstOrDefaultAsync(_ => _.Token == refreshToken);
            return user != null;
        }
    }
}
