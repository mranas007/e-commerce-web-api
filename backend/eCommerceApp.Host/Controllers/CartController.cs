using System.Security.Claims;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.Services.Interface.Cart;
using eCommerceApp.Domain.Entities.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceApp.Host.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CartController(ICartService cartService) : ControllerBase
    {

        // Add
        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart(string productId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(productId))
                {
                    return BadRequest("invalid product");
                }
                await cartService.AddToCart(Guid.Parse(productId), userId!);
                return Ok(productId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Get items from your cart
        [HttpGet("get-cart-items")]
        public async Task<IActionResult> GetCartItems()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                IEnumerable<CartItemDto> cartItems;
                if (User.IsInRole("User"))
                    // Regular user: show only their cart items
                    cartItems = await cartService.GetCartItems(userId, false);
                else
                    // Admin: show all cart items
                    cartItems = await cartService.GetCartItems(userId, true);

                // Return simple response without nested object
                Response.Headers.Append("Content-Type", "application/json");
                return Ok(cartItems);

            }
            catch (Exception ex)
            {
                // Log the exception if you have logging
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Remove
        [HttpPost("remove-to-cart")]
        public async Task<IActionResult> RemoveToCart(string productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(productId))
                return BadRequest("Invalid product");

            await cartService.RemoveToCart(Guid.Parse(productId), userId!);
            return Ok("Remove cart");
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(Checkout checkout)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await cartService.Checkout(checkout);
            return response.Success ? Ok(response) : BadRequest(response.Message);
        }

        [HttpPost("save-checkout-history")]
        public async Task<IActionResult> SaveCheckoutHistory(IEnumerable<CreateAchieve> achieves)
        {
            if (achieves == null || !achieves.Any())
                return BadRequest("No checkout history provided.");

            var response = await cartService.SaveCheckoutHistory(achieves);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
