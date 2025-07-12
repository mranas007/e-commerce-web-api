using System.ComponentModel.DataAnnotations;
using eCommerceApp.Application.DTOs.Category;
using eCommerceApp.Domain.Entities.Cart;

namespace eCommerceApp.Application.DTOs.Product
{
    public class GetProduct : ProductBase
    {
        [Required]
        public Guid Id { get; set; }
        public GetCategory? Category { get; set; }
        public CartItem? CartItem { get; set; }
    }
}
