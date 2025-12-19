using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class document_approvalModel
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
        public bool? is_required_doc { get; set; }
        public bool? is_required_approver { get; set; }
        public bool? is_final { get; set; }
        public int? source_approver_id { get; set; }
        public bool is_manually_modified { get; set; }
        public DateTime? last_sync_at { get; set; }
    }
}