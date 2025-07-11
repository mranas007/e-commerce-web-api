using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Entities.Cart;
namespace eCommerceApp.Domain.Interface.Cart
{
    public interface IPaymentMethod
    {
        Task<IEnumerable<PaymentMethod>> GetAllPaymentMethodsAsync();
    }
}
