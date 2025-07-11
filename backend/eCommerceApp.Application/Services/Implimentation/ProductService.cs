using AutoMapper;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Product;
using eCommerceApp.Application.Services.Interface;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Interface;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class ProductService : IProductService
    {
        private readonly IGeneric<Product> _product;
        private readonly IMapper _mapper;
        public ProductService(IGeneric<Product> productInterface, IMapper mapper)
        {
            _product = productInterface;
            _mapper = mapper;
        }

        public async Task<ServiceResponse> AddAsync(CreateProduct product) // Complated
        {
            var mappedProduct = _mapper.Map<Product>(product);
            int result = await _product.AddAsync(mappedProduct);

            return result > 0
                ? new ServiceResponse(true, "Product added successfully.")
                : new ServiceResponse(false, "Failed to add Product.");
        }

        public async Task<ServiceResponse> DeleteAsync(Guid id) // Complated 
        {
            int result = await _product.DeleteAsync(id);
            if (result == 0)
            {
                return new ServiceResponse(false, "Product not found.");
            }

            return result > 0
                 ? new ServiceResponse(true, "Product deleted successfully.")
                 : new ServiceResponse(false, "Failed to delete Product.");

        }

        public async Task<IEnumerable<GetProduct>> GetAllAsync() // Complated
        {

            var products = await _product.GetAllAsync();
            if (!products.Any())
                return [];

            // get into DTOs 'GetProduct' from 'Product'
            var mappedProducts = _mapper.Map<IEnumerable<GetProduct>>(products);
            return mappedProducts;
        }

        public async Task<GetProduct> GetByIdAsync(Guid id)  // Complated 
        {
            Product product = await _product.GetByIdAsync(id);
            if (product == null)
                return new GetProduct();

            var mappedProduct = _mapper.Map<GetProduct>(product);
            return mappedProduct;
        }

        public async Task<ServiceResponse> UpdateAsync(UpdateProduct updateProduct)  // Complated
        {
            var mappedProduct = _mapper.Map<Product>(updateProduct);
            var result = await _product.UpdateAsync(mappedProduct);

            // Check if the product not exists
            if (result == 0)
                return new ServiceResponse(true, "Product not found.");

            return result > 0
               ? new ServiceResponse(true, "Product updated successfully.")
               : new ServiceResponse(false, "Failed to update Product.");
        }
    }
}
