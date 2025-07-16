using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_task_assigneeRequest
    {
        public int id { get; set; }
		public int structure_employee_id { get; set; }
		public int application_task_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
    public class Updateapplication_task_assigneeRequest
    {
        public int id { get; set; }
		public int structure_employee_id { get; set; }
		public int application_task_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}