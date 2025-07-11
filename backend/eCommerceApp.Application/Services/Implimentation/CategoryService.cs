using AutoMapper;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Category;
using eCommerceApp.Application.Services.Interface;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Interface;

namespace eCommerceApp.Application.Services.Implimentation
{
    internal class CategoryService : ICategoryService
    {
        public readonly IGeneric<Category> _category;
        public readonly IMapper _mapper;
        public CategoryService(IGeneric<Category> category, IMapper mapper)
        {
            _category = category;
            _mapper = mapper;
        }

        // Create, Add
        public async Task<ServiceResponse> AddAsync(CreateCategory category) // Complated 
        {
            var mappedCategory = _mapper.Map<Category>(category);
            var result = await _category.AddAsync(mappedCategory);

            return result > 0 ? new ServiceResponse
            {
                Success = true,
                Message = "Category added successfully."
            }
            : new ServiceResponse
            {
                Success = false,
                Message = "Failed to add Category."
            };
        }

        // Delete
        public async Task<ServiceResponse> DeleteAsync(Guid id) // Complated 
        {
            int result = await _category.DeleteAsync(id);
            if (result == 0)
            {
                return new ServiceResponse(true, "Category not found.");
            }

            return result > 0
                 ? new ServiceResponse(true, "Category deleted successfully.")
                 : new ServiceResponse(false, "Failed to delete Category.");
        }

        // Get All
        public async Task<IEnumerable<GetCategory>> GetAllAsync()  // Complated  
        {
            var category = await _category.GetAllAsync();
            if (!category.Any())
                return new List<GetCategory>();

            IEnumerable<GetCategory> mappedCategory = _mapper.Map<IEnumerable<GetCategory>>(category);
            return mappedCategory;
        }

        // Get one by id
        public async Task<GetCategory> GetByIdAsync(Guid id) // Complated  
        {
            Category category = await _category.GetByIdAsync(id);
            if (category == null)
                return new GetCategory();

            var mappedCategory = _mapper.Map<GetCategory>(category);
            return mappedCategory;
        }

        // Update
        public async Task<ServiceResponse> UpdateAsync(UpdateCategory updateCategory) // Complated 
        {
            var mappedCateogry = _mapper.Map<Category>(updateCategory);
            int resutl = await _category.UpdateAsync(mappedCateogry);
            if (resutl == 0)
                return new ServiceResponse(false, "Category not Found!");

            return resutl > 0
                ? new ServiceResponse(true, "Category updated successfully.")
                : new ServiceResponse(false, "Failed to update Category.");
        }
    }
}