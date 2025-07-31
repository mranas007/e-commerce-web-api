using AutoMapper;
using eCommerceApp.Application.DTOs.NewFolder;
using eCommerceApp.Application.Services.Interface.User;
using eCommerceApp.Domain.Entities.Identity;
using eCommerceApp.Domain.Interface.Authentication;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class UserService(IUserManagement userManagement, IMapper mapper) : IUserService
    {
        public async Task<IEnumerable<GetUserDto>> GetAllUsersAsync()
        {
            var userList = await userManagement.GetAllUsersAsync();
            var userMapped = mapper.Map<IEnumerable<GetUserDto>>(userList);
            // Check if the userMapped is null or empty
            if (userMapped == null || !userMapped.Any())
                throw new System.Exception("No users found.");
            return userMapped;
        }
    }
}
