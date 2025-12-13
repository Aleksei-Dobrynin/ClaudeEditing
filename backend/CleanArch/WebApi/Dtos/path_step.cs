using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createpath_stepRequest
    {
        public int id { get; set; }
        public string step_type { get; set; }
        public int? path_id { get; set; }
        public int? responsible_org_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int order_number { get; set; }
        public bool? is_required { get; set; }
        public int? estimated_days { get; set; }
        public bool? wait_for_previous_steps { get; set; }
    }

    public class Updatepath_stepRequest
    {
        public int id { get; set; }
        public string step_type { get; set; }
        public int? path_id { get; set; }
        public int? responsible_org_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int order_number { get; set; }
        public bool? is_required { get; set; }
        public int? estimated_days { get; set; }
        public bool? wait_for_previous_steps { get; set; }
    }
}