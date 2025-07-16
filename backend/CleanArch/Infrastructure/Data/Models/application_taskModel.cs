using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class application_taskModel : BaseLogDomain
    {
        public int id { get; set; }
		public int? structure_id { get; set; }
		public int application_id { get; set; }
		public int? task_template_id { get; set; }
		public string comment { get; set; }
		public string name { get; set; }
		public bool? is_required { get; set; }
		public int? order { get; set; }
		public int status_id { get; set; }
		public int? progress { get; set; }
        public int? type_id { get; set; }
        public string type_name { get; set; }
        public DateTime? task_deadline { get; set; }
		public bool is_main { get; set; }

    }
}