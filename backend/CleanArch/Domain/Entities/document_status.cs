using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class document_status : BaseLogDomain
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
        public string background_color { get; set; }
        public string text_color { get; set; }
        public string name_kg { get; set; }
        public string description_kg { get; set; }

    }
}