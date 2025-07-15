using AutoMapper;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Product;
using eCommerceApp.Application.Services.Interface;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Interface;
using eCommerceApp.Domain.Interface.Product;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class ProductService(
        IMapper mapper,
        IProductRepository productRepository) : IProductService
    {

        // Add
        public async Task<ServiceResponse> AddAsync(CreateProduct product) // Complated
        {
            var mappedProduct = mapper.Map<Product>(product);
            int result = await productRepository.AddAsync(mappedProduct);

            return result > 0
                ? new ServiceResponse(true, "Product added successfully.")
                : new ServiceResponse(false, "Failed to add Product.");
        }

        // Delete
        public async Task<ServiceResponse> DeleteAsync(Guid id) // Complated 
        {
            int result = await productRepository.DeleteAsync(id);
            if (result == 0)
            {
                return new ServiceResponse(false, "Product not found.");
            }

            return result > 0
                 ? new ServiceResponse(true, "Product deleted successfully.")
                 : new ServiceResponse(false, "Failed to delete Product.");
        }

        // Get All
        public async Task<IEnumerable<GetProduct>> GetAllAsync(string? userId, string search, string category)
        {

            var products = await productRepository.GetAllAsync(userId!, search!, category!);
            if (!products.Any())
                return [];

            // get into DTOs 'GetProduct' from 'Product'
            var mappedProducts = mapper.Map<IEnumerable<GetProduct>>(products);
            return mappedProducts;
        }

        public async Task<GetProduct> GetByIdAsync(Guid id)  // Complated 
        {
            Product product = await productRepository.GetByIdAsync(id);
            if (product == null)
                return new GetProduct();

            var mappedProduct = mapper.Map<GetProduct>(product);
            return mappedProduct;
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateProduct updateProduct)  // Complated
        {
            var mappedProduct = mapper.Map<Product>(updateProduct);
            var result = await productRepository.UpdateAsync(mappedProduct);

            // Check if the product not exists
            if (result == 0)
                return new ServiceResponse(true, "Product not found.");

            return result > 0
               ? new ServiceResponse(true, "Product updated successfully.")
               : new ServiceResponse(false, "Failed to update Product.");
        }
    }
}
