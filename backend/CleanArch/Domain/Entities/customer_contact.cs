using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class customer_contact : BaseLogDomain
    {
        public int id { get; set; }
		public string value { get; set; }
		public int type_id { get; set; }
		public string type_name { get; set; }
		public string type_code { get; set; }
        public int customer_id { get; set; }
		public bool? allow_notification { get; set; }
		
    }
}