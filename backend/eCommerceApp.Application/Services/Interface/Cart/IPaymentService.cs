using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Application.Services.Interface.Cart
{
    public interface IPaymentService
    {
        Task<ServiceResponse> Pay(decimal totalAmount, IEnumerable<Product> cartProducts, IEnumerable<ProcessCart> carts);
    }
}
