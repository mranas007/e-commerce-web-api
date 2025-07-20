using System;
using AutoMapper;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Product;
using eCommerceApp.Application.Services.Interface;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Interface.Product;
using Microsoft.AspNetCore.Http;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class ProductService(
        IMapper mapper,
        IProductRepository productRepository) : IProductService
    {

        //***** Add *****//
        public async Task<ServiceResponse> AddAsync(CreateProduct product, ICollection<IFormFile> ImageFile) // Complated
        {
            IEnumerable<string> ImagesName = await SaveImages(ImageFile);

            // Check if any images were uploaded and saved successfully
            if (ImagesName == null || !ImagesName.Any())
                return new ServiceResponse(false, "No images were saved successfully.");

            var mappedProduct = mapper.Map<Product>(product);
            int result = await productRepository.AddAsync(mappedProduct, ImagesName);
           
            return result > 0
                ? new ServiceResponse(true, "Product added successfully.")
                : new ServiceResponse(false, "Failed to add Product.");
        }

        //***** Delete *****//
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

        //***** Get All *****//
        public async Task<IEnumerable<GetProduct>> GetAllAsync(string? userId, string search, string category)
        {

            var products = await productRepository.GetAllAsync(userId!, search!, category!);
            if (!products.Any())
                return [];

            // get into DTOs 'GetProduct' from 'Product'
            var mappedProducts = mapper.Map<IEnumerable<GetProduct>>(products);
            return mappedProducts;
        }

        //***** Get by Id *****//
        public async Task<GetProduct> GetByIdAsync(Guid id)  // Complated 
        {
            Product product = await productRepository.GetByIdAsync(id);
            if (product == null)
                return new GetProduct();

            var mappedProduct = mapper.Map<GetProduct>(product);
            return mappedProduct;
        }

        //***** Update *****//
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

        //***** Save Images *****//
        public async Task<IEnumerable<string>> SaveImages(ICollection<IFormFile> images)
        {
            if (images == null || !images.Any())
                return [];

            // Define allowed image extensions and the folder path
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            // List to hold the saved file names
            var fileNames = new List<string>();
            // Define the folder path where images will be saved
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");

            // Ensure the directory exists
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            foreach (var img in images)
            {
                // Validate the image file
                if (img.Length == 0)
                    throw new ArgumentException($"Image file {img.FileName} is empty.");
                // Check the file size (limit to 5MB)
                if (img.Length > 5 * 1024 * 1024)
                    throw new ArgumentException($"Image file {img.FileName} exceeds the limit of 5MB.");
                // Check the file extension
                var extension = Path.GetExtension(img.FileName);
                if (!allowedExtensions.Contains(extension.ToLower()))
                    throw new ArgumentException($"Invalid file type for {img.FileName}. Allowed types are: {string.Join(", ", allowedExtensions)}");

                // Generate a unique file name
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(folderPath, fileName);

                // Save the file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await img.CopyToAsync(stream);
                }

                fileNames.Add(fileName);
            }

            return fileNames;
        }

        //***** Delete Images *****//
        public int DeleteImages(ICollection<string> imagesName)
        {
            if (imagesName is null || !imagesName.Any())
                return 0;

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
            var deletedCount = 0;

            foreach (string imageName in imagesName)
            {
                var fullPath = Path.Combine(folderPath, imageName);
                if (File.Exists(fullPath))
                {
                    try 
                    {
                        File.Delete(fullPath);
                        deletedCount++;
                    }
                    catch (System.Exception ex)
                    {
                        // Log the error if needed
                        continue;
                    }
                }
            }

            return deletedCount > 0 ? 1 : 0;
        }
    }
}
