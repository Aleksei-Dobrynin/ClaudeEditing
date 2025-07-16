using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateLanguageRequest
    {
        public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public bool? isDefault { get; set; }
		public int? queueNumber { get; set; }
		public int id { get; set; }
		
    }
    public class UpdateLanguageRequest
    {
        public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public bool? isDefault { get; set; }
		public int? queueNumber { get; set; }
		public int id { get; set; }
		
    }
}