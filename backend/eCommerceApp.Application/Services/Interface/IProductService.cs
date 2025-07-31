using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Product;
using Microsoft.AspNetCore.Http;

namespace eCommerceApp.Application.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<GetProduct>> GetAllAsync(string userId, string search, string category);
        Task<GetProduct> GetByIdAsync(Guid id);
        Task<ServiceResponse> AddAsync(AddProduct product, IFormFileCollection Images);
        Task<ServiceResponse> UpdateAsync(UpdateProduct product);
        Task<ServiceResponse> DeleteAsync(Guid id);
        Task<IEnumerable<string>> SaveImages(IFormFileCollection images);
        int DeleteImages(IEnumerable<string> imagesName);
    } 
}
