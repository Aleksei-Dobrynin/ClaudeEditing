using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createcustomer_contactRequest
    {
        public int id { get; set; }
		public string value { get; set; }
		public int type_id { get; set; }
		public int customer_id { get; set; }
		public bool? allow_notification { get; set; }
		
    }
    public class Updatecustomer_contactRequest
    {
        public int id { get; set; }
		public string value { get; set; }
		public int type_id { get; set; }
		public int customer_id { get; set; }
		public bool? allow_notification { get; set; }
		
    }
}