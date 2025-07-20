using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace eCommerceApp.Application.DTOs.Product
{
    public class ProductBase
    {
        
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }

        [DataType(DataType.ImageUrl)]
        public ICollection<string>? ImageUrl { get; set; }

        [Required]
        public int Quantity { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
    }


}
