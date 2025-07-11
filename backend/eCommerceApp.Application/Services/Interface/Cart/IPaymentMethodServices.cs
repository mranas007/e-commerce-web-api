using eCommerceApp.Application.DTOs.Cart;

namespace eCommerceApp.Application.Services.Interface.Cart
{
    public interface IPaymentMethodServices
    {
        Task<IEnumerable<GetPaymentMethod>> GetAllPaymentMethodsAsync();
    }
}
