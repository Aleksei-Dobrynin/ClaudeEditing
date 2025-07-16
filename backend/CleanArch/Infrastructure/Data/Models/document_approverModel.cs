using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class document_approverModel
    {
        public int id { get; set; }
		public int? step_doc_id { get; set; }
		public int? department_id { get; set; }
		public int? position_id { get; set; }
		public bool? is_required { get; set; }
		public int approval_order { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		
    }
}