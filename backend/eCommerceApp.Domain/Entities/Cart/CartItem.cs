using System.ComponentModel.DataAnnotations.Schema;
using eCommerceApp.Domain.Entities.Identity;

namespace eCommerceApp.Domain.Entities.Cart
{
    public class CartItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [ForeignKey(nameof(User))]
        public string UserId { get; set; } = string.Empty;
        public AppUser? User { get; set; }

        public Guid ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }

        public int Quantity { get; set; } = 1;

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
