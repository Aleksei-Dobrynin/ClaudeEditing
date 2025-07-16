using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Domain.Entities
{
    public class ArchiveObjectCustomer : BaseLogDomain
    {
        public int id { get; set; }
        public int archive_object_id { get; set; }
        public int customer_id { get; set; }
        public string? description { get; set; }
        public int? parent_id { get; set; }

    }
}