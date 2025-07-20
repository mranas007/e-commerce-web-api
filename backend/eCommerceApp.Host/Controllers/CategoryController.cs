using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using eCommerceApp.Application.DTOs.Category;

namespace eCommerceApp.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _cateogryService;
        public CategoryController(ICategoryService cateogryService)
        {
            _cateogryService = cateogryService;
        }

        // get all
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _cateogryService.GetAllAsync();
            return data.Count() > 0 ? Ok(data) : NotFound(data);
        }

        // get single
        [HttpGet("single/{id}")]
        public async Task<IActionResult> GetOne(Guid id)
        {
            var data = await _cateogryService.GetByIdAsync(id);
            return data != null ? Ok(data) : NotFound(data);
        }

        // Add
        [HttpPost("add")]
        public async Task<IActionResult> Add(CreateCategory createCateogry)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            ServiceResponse result = await _cateogryService.AddAsync(createCateogry);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

        // update
        [HttpPut("update")]
        public async Task<IActionResult> Update( UpdateCategory updateCategory)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                ServiceResponse result = await _cateogryService.UpdateAsync( updateCategory);
                return result.Success ? Ok(result) : BadRequest(result.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            ServiceResponse result = await _cateogryService.DeleteAsync(id);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }
    }
}
