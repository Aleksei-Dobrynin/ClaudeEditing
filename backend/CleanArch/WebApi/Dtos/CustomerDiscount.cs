using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateCustomerDiscountRequest
    {
        public string pin_customer { get; set; }
        public string description { get; set; }
    }

    public class UpdateCustomerDiscountRequest
    {
        public int id { get; set; }
        public string pin_customer { get; set; }
        public string description { get; set; }
    }
}
