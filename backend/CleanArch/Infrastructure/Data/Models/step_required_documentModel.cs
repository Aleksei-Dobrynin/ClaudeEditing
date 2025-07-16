using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class step_required_documentModel
    {
        public int id { get; set; }
		public int? step_id { get; set; }
		public int? document_type_id { get; set; }
		public bool? is_required { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		
    }
}