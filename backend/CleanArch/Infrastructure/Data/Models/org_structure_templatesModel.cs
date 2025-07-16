using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class org_structure_templatesModel : BaseLogDomain
    {
        public int id { get; set; }
		public int structure_id { get; set; }
		public int template_id { get; set; }
		
    }
}