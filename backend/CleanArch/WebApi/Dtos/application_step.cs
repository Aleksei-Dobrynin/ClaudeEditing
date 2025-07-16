using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_stepRequest
    {
        public int id { get; set; }
		public bool? is_overdue { get; set; }
		public int? overdue_days { get; set; }
		public bool? is_paused { get; set; }
		public string comments { get; set; }
		public DateTime? created_at { get; set; }
		public int? created_by { get; set; }
		public DateTime? updated_at { get; set; }
		public int? updated_by { get; set; }
		public int? application_id { get; set; }
		public int? step_id { get; set; }
		public string status { get; set; }
		public DateTime? start_date { get; set; }
		public DateTime? due_date { get; set; }
		public DateTime? completion_date { get; set; }
		public int? planned_duration { get; set; }
		public int? actual_duration { get; set; }
		
    }
    public class Updateapplication_stepRequest
    {
        public int id { get; set; }
		public bool? is_overdue { get; set; }
		public int? overdue_days { get; set; }
		public bool? is_paused { get; set; }
		public string comments { get; set; }
		public DateTime? created_at { get; set; }
		public int? created_by { get; set; }
		public DateTime? updated_at { get; set; }
		public int? updated_by { get; set; }
		public int? application_id { get; set; }
		public int? step_id { get; set; }
		public string status { get; set; }
		public DateTime? start_date { get; set; }
		public DateTime? due_date { get; set; }
		public DateTime? completion_date { get; set; }
		public int? planned_duration { get; set; }
		public int? actual_duration { get; set; }
		
    }
}