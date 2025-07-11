using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Interface.Cart;
using eCommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace eCommerceApp.Infrastructure.Repository.Cart
{
    public class PaymentMethodRepository(AppDbContext context) : IPaymentMethod
    {
        public async Task<IEnumerable<PaymentMethod>> GetAllPaymentMethodsAsync()
        {
            return await context.PaymentMethods.AsNoTracking().ToListAsync();
        }
    }
}
