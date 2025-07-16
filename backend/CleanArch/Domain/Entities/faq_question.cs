using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class faq_question : BaseLogDomain
    {
        public int id { get; set; }
		public string title { get; set; }
		public string answer { get; set; }
		public string video { get; set; }
		public bool? is_visible { get; set; }
		public string settings { get; set; }
		
    }
}