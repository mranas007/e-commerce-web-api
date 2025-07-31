using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Interface.Product;
using eCommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;

namespace eCommerceApp.Infrastructure.Repository.Product
{
    public class ProductRepository(AppDbContext context,
        IProductImagesRepository productImagesRepository,
        IWebHostEnvironment webHostEnvironment,
        ILogger<ProductRepository> logger) : IProductRepository
    {

        // Add
        public async Task<int> AddAsync(Domain.Entities.Product product, IEnumerable<string> ImagesName)
        {
            try
            {
                if (product == null)
                    return 0;
                // Add product to context
                await context.Products.AddAsync(product);
                // Save product first to get the ID
                var result = await context.SaveChangesAsync();
                if (result > 0 && ImagesName != null && ImagesName.Any())
                {
                    try
                    {
                        // Create and add product images
                        List<ProductImage> productImages = ImagesName.Select(imageName => new ProductImage
                        {
                            Url = imageName,
                            ProductId = product.Id
                        }).ToList();

                        // Add all images in batch
                        await productImagesRepository.AddRangeAsync(productImages);
                        logger.LogInformation("products and images are saved successfully!");
                        return result;
                    }
                    catch (System.Exception er)
                    {
                        // If image addition fails, delete the product
                        context.Products.Remove(product);
                        await context.SaveChangesAsync();
                        logger.LogError("Error adding product images: {Error}", er.Message);
                        return 0;
                    }
                }
                logger.LogDebug("Error, Product isn't saved.");
                return -1;
            }
            catch (System.Exception er)
            {
                // If anything fails, return -1 to indicate failure
                logger.LogError("Something went wrong: {Error}", er.Message);
                return -1;
            }
        }

        // Get all 
        public async Task<IEnumerable<Domain.Entities.Product>> GetAllAsync(string? userId, string search, string category)
        {
            // Start with base query including Category
            var query = context.Products
                .Include(i => i.Images)
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
                Images = p.Images.ToList(),
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
            Domain.Entities.Product? product = await context.Products
               .AsNoTracking()
               .Include(i => i.Images)
               .Include(c => c.Category)
               .FirstOrDefaultAsync(p => p.Id == id);

            return product ?? new Domain.Entities.Product();
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
