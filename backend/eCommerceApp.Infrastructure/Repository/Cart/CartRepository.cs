using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Interface.Cart;
using eCommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace eCommerceApp.Infrastructure.Repository.Cart
{
    public class CartRepository(AppDbContext context) : ICart
    {
        // add a product to the cart
        public async Task<int> AddToCart(Guid productId, string userId)
        {
            var product = await context.CartItems
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.UserId == userId);
            if (product is null)
            {
                CartItem cartitem = new()
                {
                    ProductId = productId,
                    UserId = userId,
                    Quantity = 1,
                };
                context.CartItems.Add(cartitem);
                return await context.SaveChangesAsync();
            }
            //#pragma warning disable CS8602 // Dereference of a possibly null reference.
            if (product?.ProductId != null && product.Quantity > 0)
            {
                product.Quantity += 1;
                product.UpdatedAt = DateTime.UtcNow;
            }

            //#pragma warning restore CS8602 // Dereference of a possibly null reference.
            return await context.SaveChangesAsync();
        }

        // get all cart items for a user
        public async Task<IEnumerable<CartItem>> GetCartItems(string userId, bool admin = false)
        {
            // To avoid circular reference and over-fetching navigation properties,
            // use AsNoTracking and only include the necessary navigation properties.
            // Avoid deep navigation includes unless absolutely needed.

            IQueryable<CartItem> query = context.CartItems.AsNoTracking();

            if (!admin)
            {
                query = query.Where(p => p.UserId == userId);
            }

            // Only include Product, and avoid including further navigation properties from Product
            query = query.Include(ci => ci.Product)
                        .Select(ci => new CartItem
                        {
                            Id = ci.Id,
                            UserId = ci.UserId,
                            ProductId = ci.ProductId,
                            Quantity = ci.Quantity,
                            CreatedAt = ci.CreatedAt,
                            UpdatedAt = ci.UpdatedAt,
                            Product = ci.Product,
                            User = null // Avoid circular reference
                        });

            // Optionally, you can use Select to project only the fields you need to DTOs,
            // but here we just return the entities with Product included (no further navigation).

            return await query.ToListAsync();
        }

     
        public async Task<int> RemoveToCart(Guid productId, string userId)
        {
           
            var cartItem = await context.CartItems
                .FirstOrDefaultAsync(p => p.ProductId == productId && p.UserId == userId);
            // If cartItem is null here, it means there is no cart item in the database with BOTH this productId and userId.

            if (cartItem == null)
            {
                // Nothing to remove
                return 0;
            }

            if (cartItem.Quantity > 1)
            {
                cartItem.Quantity -= 1;
                cartItem.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Remove the item entirely if quantity is 1 or less
                context.CartItems.Remove(cartItem);
            }

            return await context.SaveChangesAsync();
        }

        // save the checkout history after checkout
        public async Task<int> SaveCheckoutHistory(IEnumerable<Achieve> checkouts)
        {
            context.CheckoutAchieve.AddRange(checkouts);
            return await context.SaveChangesAsync();
        }
    }
}
