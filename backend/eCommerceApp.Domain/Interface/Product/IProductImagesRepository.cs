using eCommerceApp.Domain.Entities;

namespace eCommerceApp.Domain.Interface.Product
{
    public interface IProductImagesRepository
    {
        //**** Adds a new product image to the repository.
        Task<int> AddRangeAsync(List<ProductImage> productImages);

        //***** Deletes a product image by its ID.
        Task<int> DeleteAsync(Guid id);

        /// Gets all images associated with a specific product.
        Task<IEnumerable<ProductImage>> GetAllByProductIdAsync(Guid productId);
    }
}
