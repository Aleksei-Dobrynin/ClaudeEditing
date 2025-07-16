using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class notification : BaseLogDomain
    {
        public int id { get; set; }
		public string title { get; set; }
		public string text { get; set; }
		public int? employee_id { get; set; }
		public int? user_id { get; set; }
		public bool? has_read { get; set; }
		public string code { get; set; }
		public string link { get; set; }

    }
}