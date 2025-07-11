using AutoMapper;
using eCommerceApp.Application.DTOs;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Interface.Cart;
using eCommerceApp.Application.Services.Interface.Cart;
using eCommerceApp.Domain.Entities;
using eCommerceApp.Domain.Interface;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class CartService
        (ICart cartInterface,
        IMapper mapper,
        IGeneric<Product> productInterface,
        IPaymentMethodServices paymentMethodService,
        IPaymentService paymentService
        ) : ICartService
    {
        public async Task<ServiceResponse> Checkout(Checkout checkout)
        {
            var (products, totalAmount) = await GetCartTotalAmount(checkout.Carts);
            var paymentMethods = await paymentMethodService.GetAllPaymentMethodsAsync();

            if (checkout.Carts == null || !checkout.Carts.Any())
                return new ServiceResponse { Success = false, Message = "No items in cart" };

            if (totalAmount <= 0)
                return new ServiceResponse { Success = false, Message = "Total amount is zero or negative" };

            if (!paymentMethods.Any())
                return new ServiceResponse { Success = false, Message = "No payment methods available" };

            if (checkout.PaymentMethodId == paymentMethods.FirstOrDefault()!.Id)
                return await paymentService.Pay(totalAmount, products, checkout.Carts);
            
            return new ServiceResponse { Success = false, Message = "invalid payment method" };
        }
        public async Task<ServiceResponse> SaveCheckoutHistory(IEnumerable<CreateAchieve> achieves)
        {
            var mappedData = mapper.Map<IEnumerable<Achieve>>(achieves);
            var result = await cartInterface.SaveCheckoutHistory(mappedData);
            return result > 0 ? new ServiceResponse { Success = true, Message = "Checkout Achived" } : new ServiceResponse { Success = false, Message = "Error Occured in saving." };
        }

        private async Task<(IEnumerable<Product>, decimal)> GetCartTotalAmount(IEnumerable<ProcessCart> carts)
        {
            if (!carts.Any()) return (Enumerable.Empty<Product>(), 0);
            var products = await productInterface.GetAllAsync();
            if (!products.Any()) return ([], 0);

            var cartProducts = carts
                .Select(cart => products.FirstOrDefault(p => p.Id == cart.ProductId))
                .Where(p => p != null).ToList();

            var totalAmount = carts
              .Where(cartItem => cartProducts.Any(p => p!.Id == cartItem.ProductId))
              .Sum(cartItem => cartItem.Quantity * cartProducts.First(p => p!.Id == cartItem.ProductId)!.Price);

            return (cartProducts!, totalAmount);
        }
    }
}