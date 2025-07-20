using System.Security.Claims;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Product;
using eCommerceApp.Application.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceApp.Host.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        // get all
        [HttpGet("all")]
        public async Task<IActionResult> GetAll(
            [FromQuery] string search = "",
            [FromQuery] string category = "",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 24)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var data = await _productService.GetAllAsync(userId!, search!, category!);

            return data.Any() ? Ok(data) : NotFound(data);
        }

        // get single
        [HttpGet("single/{id}")]
        public async Task<IActionResult> GetOne(Guid id)
        {
            var data = await _productService.GetByIdAsync(id);
            return data != null ? Ok(data) : NotFound(data);
        }

        // Add
        [HttpPost("add")]
        public async Task<IActionResult> Add([FromForm] CreateProduct createProduct, [FromForm] ICollection<IFormFile> imageFiles)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (imageFiles == null || imageFiles.Count == 0)
                return BadRequest("Image file not found.");

            ServiceResponse result = await _productService.AddAsync(createProduct, imageFiles);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

        // update
        [HttpPut("update")]
        public async Task<IActionResult> Update(UpdateProduct updateProduct)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            ServiceResponse result = await _productService.UpdateAsync(updateProduct);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

        // delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            ServiceResponse result = await _productService.DeleteAsync(id);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

    }
}
