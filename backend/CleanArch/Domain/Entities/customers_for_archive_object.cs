using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class customers_for_archive_object : BaseLogDomain
    {
        public int id { get; set; }
        public string full_name { get; set; }
        public string? pin { get; set; }
        public string? address { get; set; }
        public bool? is_organization { get; set; }
        public string? description { get; set; }
        public string? dp_outgoing_number { get; set; }
    }

    public class customers_objects
    {
        public string full_name { get; set; }
        public int? obj_id { get; set; }

    }
}
