using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class application_subtaskModel : BaseLogDomain
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int? subtask_template_id { get; set; }
		public string name { get; set; }
		public int status_id { get; set; }
		public int? progress { get; set; }
		public int application_task_id { get; set; }
		public string description { get; set; }
        public int? type_id { get; set; }
        public string type_name { get; set; }
        public DateTime? subtask_deadline { get; set; }

    }
}