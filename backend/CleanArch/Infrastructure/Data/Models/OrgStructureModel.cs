using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    internal class OrgStructureModel : BaseLogDomain
    {
        public int id { get; set; }
        public int? parent_id { get; set; }
        public string unique_id { get; set; }
        public string name { get; set; }
        public string? version { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public string remote_id { get; set; }
        public string? short_name { get; set; }
    }
}
