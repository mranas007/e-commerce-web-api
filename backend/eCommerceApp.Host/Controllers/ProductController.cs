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
        private readonly IProductService _cateogryService;
        public ProductController(IProductService productService)
        {
            _cateogryService = productService;
        }

        // get all
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            // Get the user id from the claims
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var data = await _cateogryService.GetAllAsync(userId!);
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
        public async Task<IActionResult> Add(CreateProduct createProduct)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            ServiceResponse result = await _cateogryService.AddAsync(createProduct);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

        // update
        [HttpPut("update")]
        public async Task<IActionResult> Update(UpdateProduct updateProduct)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            ServiceResponse result = await _cateogryService.UpdateAsync(updateProduct);
            return result.Success ? Ok(result) : BadRequest(result.Message);
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
