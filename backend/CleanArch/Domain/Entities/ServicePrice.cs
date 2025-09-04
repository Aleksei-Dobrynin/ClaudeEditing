using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ServicePrice : BaseLogDomain
    {
        public int id { get; set; }
        public int service_id { get; set; }
        public string service_name { get; set; }
        public int structure_id { get; set; }
        public string structure_name { get; set; }
        public decimal price { get; set; }
        public int document_template_id { get; set; }
        public string document_template_name { get; set; }
    }
}
