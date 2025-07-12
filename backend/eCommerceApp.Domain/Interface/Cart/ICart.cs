using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Domain.Interface.Cart
{
    public interface ICart
    {
        Task<int> SaveCheckoutHistory(IEnumerable<Achieve> checkouts);
        Task<int> AddToCart(Guid productId, string userId);
        Task<int> RemoveToCart(Guid productId, string userId);
        Task<IEnumerable<CartItem>> GetCartItems(string userId, bool admin = false);

    }
}
