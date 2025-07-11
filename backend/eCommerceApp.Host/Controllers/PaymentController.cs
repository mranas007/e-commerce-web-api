using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.Services.Interface.Cart;
using Microsoft.AspNetCore.Mvc;

namespace eCommerceApp.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController(IPaymentMethodServices paymentMethodService) : ControllerBase
    {

        [HttpGet("payment-methods")]
        public async Task<ActionResult<IEnumerable<GetPaymentMethod>>> GetPaymentMethods()
        {
            // This is a placeholder for the actual implementation.
            // You would typically call a service to get the payment methods.
            IEnumerable<GetPaymentMethod> paymentMethods = await paymentMethodService.GetAllPaymentMethodsAsync();
            if (paymentMethods == null || !paymentMethods.Any())
            {
                return NotFound(new { Success = false, Message = "No payment methods found." });
            }

            return Ok(new { Success = true, Message = "Payment methods retrieved successfully.", Data = paymentMethods });
        }
    }
}
