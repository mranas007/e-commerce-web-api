using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.Services.Interface.Cart;
using eCommerceApp.Domain.Entities;
using Stripe.Checkout;

namespace eCommerceApp.Infrastructure.Services
{
    public class StripePaymentService : IPaymentService
    {
        public Task<ServiceResponse> Pay(decimal totalAmount, IEnumerable<Product> cartProducts, IEnumerable<ProcessCart> carts)
        {
            try
            {
                var lineItems = new List<SessionLineItemOptions>();
                foreach (var item in cartProducts)
                {
                    var productQuantity = carts.FirstOrDefault(c => c.ProductId == item.Id);
                    lineItems.Add(new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = item.Name,
                                Description = item.Description
                            },
                            UnitAmount = (long)(item.Price * 100), // Stripe expects the amount in cents
                        },
                        Quantity = productQuantity?.Quantity ?? 1 // Default to 1 if not found
                    });
                }

                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = ["usd"],
                    LineItems = lineItems,
                    Mode = "payment",
                    SuccessUrl = "https://yourdomain.com/payment-success",
                    CancelUrl = "https://yourdomain.com/payment-cancel",
                };

                var service = new SessionService();
                Session session = service.Create(options);

                // Wrap the ServiceResponse in a Task using Task.FromResult
                return Task.FromResult(new ServiceResponse(true, Message: session.Url));
            }
            catch (System.Exception ex)
            {
                // Handle exceptions and return a failed ServiceResponse
                return Task.FromResult(new ServiceResponse(false, ex.Message));
            }
        }
    }
}
