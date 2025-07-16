using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_pause
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? application_id { get; set; }
		public int? app_step_id { get; set; }
		public string pause_reason { get; set; }
		public DateTime? pause_start { get; set; }
		public DateTime? pause_end { get; set; }
		public string comments { get; set; }
		public bool? is_excluded_from_sla { get; set; }
		public DateTime? created_at { get; set; }
		
    }
}