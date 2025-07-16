using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createcontact_typeRequest
    {
        public int id { get; set; }
		public string? name { get; set; }
		public string? description { get; set; }
		public string? code { get; set; }
		public string? additional { get; set; }
		
    }
    public class Updatecontact_typeRequest
    {
        public int id { get; set; }
		public string? name { get; set; }
		public string? description { get; set; }
		public string? code { get; set; }
		public string? additional { get; set; }
		
    }
}