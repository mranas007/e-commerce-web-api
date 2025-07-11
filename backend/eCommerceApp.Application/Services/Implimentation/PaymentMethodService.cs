using AutoMapper;
using eCommerceApp.Application.DTOs.Cart;
using eCommerceApp.Application.Services.Interface.Cart;
using eCommerceApp.Domain.Interface.Cart;

namespace eCommerceApp.Application.Services.Implimentation
{
    public class PaymentMethodService(IPaymentMethod paymentMethodRepository, IMapper mapper) : IPaymentMethodServices
    {
        public async Task<IEnumerable<GetPaymentMethod>> GetAllPaymentMethodsAsync()
        {
            var methods = await paymentMethodRepository.GetAllPaymentMethodsAsync();
            if (methods!.Any()) return [];

            return mapper.Map<IEnumerable<GetPaymentMethod>>(methods);
        }

    }
}
