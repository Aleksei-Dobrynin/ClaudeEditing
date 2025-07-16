using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class architecture_statusModel
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string name_kg { get; set; }
		public string description_kg { get; set; }
		public string text_color { get; set; }
		public string background_color { get; set; }
		public DateTime? created_at { get; set; }
		
    }
}