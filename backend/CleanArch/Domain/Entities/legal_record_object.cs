using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class legal_record_object
    {
        public int id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int id_record { get; set; }
		public int id_object { get; set; }
		
    }
}