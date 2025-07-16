using System;
using System.Collections.Generic;
using System.Diagnostics.Tracing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class document_approver
    {
        public int id { get; set; }
		public int? step_doc_id { get; set; }
		public int? department_id { get; set; }
        public string department_name { get; set; }
        public int? position_id { get; set; }
		public string position_name { get; set; }
		public bool? is_required { get; set; }
		public int approval_order { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public document_approval apprval { get; set; }

    }
}