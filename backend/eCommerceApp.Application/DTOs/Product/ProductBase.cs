using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using eCommerceApp.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace eCommerceApp.Application.DTOs.Product
{
    public class ProductBase
    {
        
        [Required]
        public string? Name { get; set; }
        [Required]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public int Quantity { get; set; }
        public List<ProductImage>? Images { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        public Domain.Entities.Category? Category { get; set; }
    }
}
