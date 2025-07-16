using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class employee_contact : BaseLogDomain
    {
        public int id { get; set; }
		public string value { get; set; }
		public int? employee_id { get; set; }
		public int? type_id { get; set; }
		public string type_name { get; set; }
		public string type_code{ get; set; }
		public bool? allow_notification { get; set; }

    }

    public class SetTelegramContact
    {
        public int chat_id { get; set; }
        public string guid { get; set; }

    }
}