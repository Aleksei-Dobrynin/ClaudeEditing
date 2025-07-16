using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_objectRequest
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int arch_object_id { get; set; }
		
    }
    public class Updateapplication_objectRequest
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int arch_object_id { get; set; }
		
    }
}