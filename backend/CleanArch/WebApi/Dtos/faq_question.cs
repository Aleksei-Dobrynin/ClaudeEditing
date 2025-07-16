using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createfaq_questionRequest
    {
        public int id { get; set; }
		public string? title { get; set; }
		public string? answer { get; set; }
		public string? video { get; set; }
		public bool? is_visible { get; set; }
		public string? settings { get; set; }
		
    }
    public class Updatefaq_questionRequest
    {
        public int id { get; set; }
        public string? title { get; set; }
        public string? answer { get; set; }
        public string? video { get; set; }
        public bool? is_visible { get; set; }
        public string? settings { get; set; }

    }
}