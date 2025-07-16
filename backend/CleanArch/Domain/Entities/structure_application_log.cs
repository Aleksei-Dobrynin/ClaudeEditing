using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class structure_application_log
    {
        public int id { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public DateTime? updated_at { get; set; }
		public DateTime? created_at { get; set; }
		public int? structure_id { get; set; }
		public int? application_id { get; set; }
		public string status { get; set; }
		public string status_code { get; set; }
        public string? structure_name { get; set; }
		public string? app_number { get; set; }
		
    }
}