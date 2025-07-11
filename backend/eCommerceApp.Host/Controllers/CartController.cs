using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.Services.Interface.Cart;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceApp.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(ICartService cartService) : ControllerBase
    {
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
