using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class org_structure_templates : BaseLogDomain
    {
        public int id { get; set; }
		public int structure_id { get; set; }
		public int template_id { get; set; }
        public string template_name { get; set; }
		
    }
}