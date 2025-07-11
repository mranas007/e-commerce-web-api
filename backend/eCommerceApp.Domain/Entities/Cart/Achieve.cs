using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eCommerceApp.Domain.Entities.Cart
{
    public class Achieve
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProductId { get; set; } 
        public int Quantity { get; set; } 
        public Guid UserId { get; set; }
        public DateTime CreatedData { get; set; } = DateTime.Now;
    }
}
