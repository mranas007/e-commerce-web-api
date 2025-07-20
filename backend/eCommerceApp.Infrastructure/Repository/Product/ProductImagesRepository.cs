using System.Collections.Generic;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Interface.Product;
using eCommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace eCommerceApp.Infrastructure.Repository.Product
{
    public class ProductImagesRepository(AppDbContext context) : IProductImagesRepository
    {
        
        // Add by range
        public async Task<int> AddRangeAsync(List<ProductImage> productImages)
        {
            await context.ProductImages.AddRangeAsync(productImages);
            return await context.SaveChangesAsync();
        }


        // Deletes a product image by its ID.
        public async Task<int> DeleteAsync(Guid id)
        {
            await context.ProductImages
                .Where(pi => pi.Id == id)
                .ExecuteDeleteAsync();
            return await context.SaveChangesAsync();
        }

        // Deletes all images associated with a specific product by its ID.
        public async Task<int> DeleteByProductIdAsync(Guid productId)
        {
            await context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .ExecuteDeleteAsync();
            return await context.SaveChangesAsync();
        }

        // Gets all images associated with a specific product.
        public async Task<IEnumerable<ProductImage>> GetAllByProductIdAsync(Guid productId)
        {
            List<ProductImage> productImages = await context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .ToListAsync();
            return !productImages.Any() ? productImages : [];
        }
    }
}
