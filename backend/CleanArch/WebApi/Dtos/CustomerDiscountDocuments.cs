using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateCustomerDiscountDocumentsRequest
    {
        public int customer_discount_id { get; set; }
        public int discount_documents_id { get; set; }
    }

    public class UpdateCustomerDiscountDocumentsRequest
    {
        public int id { get; set; }
        public int customer_discount_id { get; set; }
        public int discount_documents_id { get; set; }
    }
}
