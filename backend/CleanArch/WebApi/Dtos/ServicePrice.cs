using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateServicePriceRequest
    {
        public int service_id { get; set; }
        public int structure_id { get; set; }
        public int document_template_id { get; set; }
        public decimal price { get; set; }
    }

    public class UpdateServicePriceRequest
    {
        public int id { get; set; }
        public int service_id { get; set; }
        public int structure_id { get; set; }
        public int document_template_id { get; set; }
        public decimal price { get; set; }
    }
}
