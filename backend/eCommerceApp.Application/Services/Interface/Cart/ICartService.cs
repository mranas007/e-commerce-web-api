using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Application.Services.Interface.Cart
{
    public interface ICartService
    {
        Task<ServiceResponse> SaveCheckoutHistory(IEnumerable<CreateAchieve> checkouts);
        Task<ServiceResponse> Checkout(Checkout checkout);
    }
}
