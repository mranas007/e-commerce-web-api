using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Domain.Entities
{
    public class Product
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }
        
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

        [Required]
        public int Quantity { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public Category? Category { get; set; } // Navigation property

        public ICollection<CartItem>? CartItems { get; set; }

    }
}
