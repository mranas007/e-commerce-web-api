using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Interface.Cart;
using eCommerceApp.Infrastructure.Data;

namespace eCommerceApp.Infrastructure.Repository.Cart
{
    public class CartRepository(AppDbContext context) : ICart
    {
        public async Task<int> SaveCheckoutHistory(IEnumerable<Achieve> checkouts)
        {
            context.CheckoutAchieve.AddRange(checkouts);
            return await context.SaveChangesAsync();
        }
    }
}
