using eCommerceApp.Application.DTOs.NewFolder;
using eCommerceApp.Domain.Entities.Identity;

namespace eCommerceApp.Application.Services.Interface.User
{
    public interface IUserService
    {
        Task<IEnumerable<GetUserDto>> GetAllUsersAsync();
    }
}
