using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class application_squareModel
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int structure_id { get; set; }
		public int unit_type_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public double? value { get; set; }
		
    }
}