using eCommerceApp.Domain.Interface;
using eCommerceApp.Infrastructure.Data;
using eCommerceApp.Infrastructure.Exception;
using Microsoft.EntityFrameworkCore;

namespace eCommerceApp.Infrastructure.Repository
{
    public class GenericRepository<TEntity>(AppDbContext context) : IGeneric<TEntity> where TEntity : class
    {
        public async Task<int> AddAsync(TEntity entity)
        {
            _ = context.Set<TEntity>().AddAsync(entity);
            return await context.SaveChangesAsync();
        }

        public async Task<int> DeleteAsync(Guid id)
        {
            var entity = await context.Set<TEntity>().FindAsync(id);
            if (entity is null)
                return 0;

            context.Set<TEntity>().Remove(entity);
            return await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await context.Set<TEntity>().AsNoTracking().ToListAsync();
        }

        public async Task<TEntity> GetByIdAsync(Guid id)
        {
            var valueTask = await context.Set<TEntity>().FindAsync(id);
            return valueTask!;
        }

        public async Task<int> UpdateAsync(TEntity entity)
        {
            context.Set<TEntity>().Update(entity);
            return await context.SaveChangesAsync();
        }
    }
}
