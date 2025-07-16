using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateS_PlaceHolderTemplateRequest
    {
		public string name { get; set; }
		public string value { get; set; }
		public string code { get; set; }
		public int idQuery { get; set; }
		public int idPlaceholderType { get; set; }
		
    }
    public class UpdateS_PlaceHolderTemplateRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string value { get; set; }
		public string code { get; set; }
		public int idQuery { get; set; }
		public int idPlaceholderType { get; set; }
		
    }
}