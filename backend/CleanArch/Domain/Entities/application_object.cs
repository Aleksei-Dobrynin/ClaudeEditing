using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_object : BaseLogDomain
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int arch_object_id { get; set; }
		
    }
}