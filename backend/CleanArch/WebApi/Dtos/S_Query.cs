using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateS_QueryRequest
    {
        public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string query { get; set; }
		public int id { get; set; }
		
    }
    public class UpdateS_QueryRequest
    {
        public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string query { get; set; }
		public int id { get; set; }
		
    }
}