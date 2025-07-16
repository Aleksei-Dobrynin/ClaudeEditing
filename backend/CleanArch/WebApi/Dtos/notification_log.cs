using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createnotification_logRequest
    {
        public int id { get; set; }
		public int? employee_id { get; set; }
		public int? user_id { get; set; }
		public string message { get; set; }
		public string subject { get; set; }
		public string guid { get; set; }
		public DateTime? date_send { get; set; }
		public string type { get; set; }
		public int? status_id { get; set; }
		
    }
    public class Updatenotification_logRequest
    {
        public int id { get; set; }
		public int? employee_id { get; set; }
		public int? user_id { get; set; }
		public string message { get; set; }
		public string subject { get; set; }
		public string guid { get; set; }
		public DateTime? date_send { get; set; }
		public string type { get; set; }
        public int? status_id { get; set; }

    }
}