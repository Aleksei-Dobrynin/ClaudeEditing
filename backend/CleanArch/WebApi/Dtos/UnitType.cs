using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateUnitTypeRequest
    {
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string type { get; set; }
		
    }
    public class UpdateUnitTypeRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string type { get; set; }
		
    }
}