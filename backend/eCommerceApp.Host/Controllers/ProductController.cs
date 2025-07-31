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
        private readonly ILogger _logger;
        public ProductController(IProductService productService, ILogger<ProductController> logger)
        {
            _productService = productService;
            _logger = logger;
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
        [HttpPost("add-product")]
        public async Task<IActionResult> Add([FromForm] AddProduct product)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                ServiceResponse result = await _productService.AddAsync(product, product.Images!);
                return result.Success ? Ok(result) : BadRequest(result.Message);
            }
            catch (Exception ex)
            {
                // Log the exception details to your server logs
                _logger.LogError(ex, "Error adding product");
                return StatusCode(500, "An internal server error occurred.");
            }


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
