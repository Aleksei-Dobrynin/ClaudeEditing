using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class step_required_document
    {
        public int id { get; set; }
		public int? step_id { get; set; }
		public int? document_type_id { get; set; }
        public int? service_doc_id { get; set; }
        public string doc_name { get; set; }
		public bool? is_required { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public bool can_assign { get; set; }
        public string assign_status { get; set; }
        public List<document_approver> approvers { get; set; }
        public uploaded_application_document upl_doc { get; set; }
        public string? document_type_name { get; set; }

    }
}