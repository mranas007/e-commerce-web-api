using System.ComponentModel.DataAnnotations;
using eCommerceApp.Application.DTOs.Category;

namespace eCommerceApp.Application.DTOs.Product
{
    public class GetProduct : ProductBase
    {
        [Required]
        public Guid Id { get; set; }
        public GetCategory? Category { get; set; }
    }
}
