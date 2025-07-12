using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Application.Services.Interface.Cart
{
    public interface ICartService
    {
        Task<int> AddToCart(Guid ProductId, string userId);
        Task<int> RemoveToCart(Guid ProductId, string userId);
        Task<IEnumerable<CartItemDto>> GetCartItems(string userId, bool admin = false);
        Task<ServiceResponse> SaveCheckoutHistory(IEnumerable<CreateAchieve> checkouts);
        Task<ServiceResponse> Checkout(Checkout checkout);
    }
}
