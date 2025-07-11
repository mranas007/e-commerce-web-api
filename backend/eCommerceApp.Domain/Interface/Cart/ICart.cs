using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Domain.Interface.Cart
{
    public interface ICart
    {
        Task<int> SaveCheckoutHistory(IEnumerable<Achieve> checkouts);
    }
}
