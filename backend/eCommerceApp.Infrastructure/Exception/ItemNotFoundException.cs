using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eCommerceApp.Infrastructure.Exception
{
    public class ItemNotFoundException(string message) : IOException(message)
    {

    }
}
