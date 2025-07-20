using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eCommerceApp.Domain.Entities
{
    public class ProductImage
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [DataType(DataType.ImageUrl)]
        public string Url { get; set; } = string.Empty;

        [Required]
        public Guid ProductId { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
    }
}
