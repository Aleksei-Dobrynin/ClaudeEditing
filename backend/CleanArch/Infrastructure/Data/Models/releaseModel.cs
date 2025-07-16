using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class releaseModel
    {
        public int id { get; set; }
		public int? updated_by { get; set; }
		public string number { get; set; }
		public string description { get; set; }
		public string description_kg { get; set; }
		public string code { get; set; }
		public DateTime? date_start { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		
    }
}