using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Interface.Product;
using eCommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace eCommerceApp.Infrastructure.Repository.Product
{
    public class ProductRepository(AppDbContext context) : IProductRepository
    {

        // Add
        public async Task<int> AddAsync(Domain.Entities.Product product)
        {
            context.Products.Add(product);
            return await context.SaveChangesAsync();
        }

        // Get all 
        public async Task<IEnumerable<Domain.Entities.Product>> GetAllAsync(string? userId, string search, string category)
        {
            // Start with base query including Category
            var query = context.Products
                .AsNoTracking()
                .AsQueryable();

            // Filter by category if provided
            if (!string.IsNullOrEmpty(category))
                query = query.Include(p => p.Category).Where(c => c.Category != null && c.Category.Name == category);
            else
                query = query.Include(p => p.Category);

            // Filter by search if provided (search in Name and Description)
            if (!string.IsNullOrEmpty(search))
            {
                string loweredSearch = search.ToLower();
                query = query.Where(p =>
                    (!string.IsNullOrEmpty(p.Name) && p.Name.ToLower().Contains(loweredSearch)) ||
                    (!string.IsNullOrEmpty(p.Description) && p.Description.ToLower().Contains(loweredSearch))
                );
            }

            // If userId is provided, include CartItems filtered by userId
            if (!string.IsNullOrEmpty(userId))
            {
                query = query
                    .Include(p => p.CartItems!
                        .Where(c => c.UserId == userId));
            }

            return await query.Select(p => new Domain.Entities.Product
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Image = p.Image,
                Quantity = p.Quantity,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                CategoryId = p.CategoryId,
                Category = p.Category,
                CartItems = !string.IsNullOrEmpty(userId)
                    ? p.CartItems != null ? p.CartItems.Where(c => c.UserId == userId).ToList() : new List<CartItem>()
                    : p.CartItems
            }).ToListAsync();
        }

        // Get by ID
        public async Task<Domain.Entities.Product> GetByIdAsync(Guid id)
        {
            return await context.Products.FindAsync(id);
        }

        // Update
        public async Task<int> UpdateAsync(Domain.Entities.Product product)
        {
            context.Products.Update(product);
            return await context.SaveChangesAsync();
        }

        // Delete
        public async Task<int> DeleteAsync(Guid id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null) return 0;
            context.Products.Remove(product);
            return await context.SaveChangesAsync();
        }
    }
}
