using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eCommerceApp.Domain.Entities;

namespace eCommerceApp.Domain.Interface.Product
{
    public interface IProductRepository
    {
        Task<int> AddAsync(Domain.Entities.Product product);
        Task<IEnumerable<Domain.Entities.Product>> GetAllAsync(string userId);
        Task<Domain.Entities.Product> GetByIdAsync(Guid id);
        Task<int> UpdateAsync(Domain.Entities.Product product);
        Task<int> DeleteAsync(Guid id);
    }
}
