using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class SmProject
    {

        public int id { get; set; }
        public string name { get; set; }
        public int projecttype_id { get; set; }
        public bool? test { get; set; }
        public int status_id { get; set; }
        public int? min_responses { get; set; }
        public DateTime? date_end { get; set; }
        public string access_link { get; set; }
        public DateTime? updated_at { get; set; }
        public DateTime? created_at { get; set; }
        public int? updated_by { get; set; }
        public int? created_by { get; set; }
        public int entity_id { get; set; }
        public int? frequency_id { get; set; }
        public bool? is_triggers_required { get; set; }
        public int? date_attribute_milestone_id { get; set; }

        public SmProjectType SmProjectType { get; set; }
    }
}
