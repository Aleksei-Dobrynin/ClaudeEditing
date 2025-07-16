using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_subtask_assignee
    {
        public int id { get; set; }
		public int structure_employee_id { get; set; }
		public int application_subtask_id { get; set; }
		public string? employee_name { get; set; }
		public string? employee_ocupation {  get; set; }	
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}