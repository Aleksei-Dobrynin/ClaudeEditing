using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createorg_structure_templatesRequest
    {
        public int id { get; set; }
		public int structure_id { get; set; }
		public int template_id { get; set; }
		
    }
    public class Updateorg_structure_templatesRequest
    {
        public int id { get; set; }
		public int structure_id { get; set; }
		public int template_id { get; set; }
		
    }
}