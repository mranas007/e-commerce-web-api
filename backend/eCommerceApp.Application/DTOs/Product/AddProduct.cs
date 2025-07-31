using eCommerceApp.Domain.Entities.Cart;
using eCommerceApp.Domain.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace eCommerceApp.Application.DTOs.Product
{
    public class AddProduct
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }

        [Required]
        public IFormFileCollection? Images { get; set; } 

        [Required]
        public int Quantity { get; set; }

        [Required]
        public Guid? CategoryId { get; set; } 
    }
}
