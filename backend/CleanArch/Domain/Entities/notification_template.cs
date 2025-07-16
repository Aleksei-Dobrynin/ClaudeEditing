using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class notification_template : BaseLogDomain
    {
        public int id { get; set; }
		public int? contact_type_id { get; set; }
		public string code { get; set; }
		public string subject { get; set; }
		public string body { get; set; }
		public string placeholders { get; set; }
		public string link { get; set; }

    }
}