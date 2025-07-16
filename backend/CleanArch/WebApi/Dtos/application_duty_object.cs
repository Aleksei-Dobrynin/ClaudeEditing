using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_duty_objectRequest
    {
        public int id { get; set; }
		public int? dutyplan_object_id { get; set; }
		public int? application_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
    public class Updateapplication_duty_objectRequest
    {
        public int id { get; set; }
		public int? dutyplan_object_id { get; set; }
		public int? application_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}