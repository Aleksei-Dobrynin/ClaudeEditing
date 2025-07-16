using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createdocument_approvalRequest
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? app_document_id { get; set; }
		public int? file_sign_id { get; set; }
		public int? department_id { get; set; }
		public int? position_id { get; set; }
		public string status { get; set; }
		public DateTime? approval_date { get; set; }
		public string comments { get; set; }
		public DateTime? created_at { get; set; }
        public int? app_step_id { get; set; }
        public int? document_type_id { get; set; }

    }
    public class Updatedocument_approvalRequest
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? app_document_id { get; set; }
		public int? file_sign_id { get; set; }
		public int? department_id { get; set; }
		public int? position_id { get; set; }
		public string status { get; set; }
		public DateTime? approval_date { get; set; }
		public string comments { get; set; }
		public DateTime? created_at { get; set; }
        public int? app_step_id { get; set; }
        public int? document_type_id { get; set; }

    }
}