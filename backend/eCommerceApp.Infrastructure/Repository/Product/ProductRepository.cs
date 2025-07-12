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
        public async Task<IEnumerable<Domain.Entities.Product>> GetAllAsync(string? userId)
        {
            // Fetch all products and include only CartItems for the given user
            return await context.Products
                .Include(p => p.CartItems!.Where(ci => ci.UserId == userId))
                .ToListAsync();
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
