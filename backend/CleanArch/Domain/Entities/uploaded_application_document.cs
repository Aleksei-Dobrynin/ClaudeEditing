using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class uploaded_application_document : BaseLogDomain
    {
        public int id { get; set; }
		public int? file_id { get; set; }
		public int? app_step_id { get; set; }
        public int? application_document_id { get; set; }
		public string name { get; set; }
		public int? service_document_id { get; set; }
		public int? document_type_id { get; set; }
        public string app_doc_name { get; set; }
		public DateTime? created_at { get; set; }
		public string created_by_name { get; set; }
		public string structure_name { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
        public File document { get; set; }
        public bool? is_outcome { get; set; }
        public string? document_number { get; set; }
        public string? file_name { get; set; }
        public List<string>? app_docs { get; set; }
        public int? status_id { get; set; }
        public bool? add_sign { get; set; }

    } 

    public class CustomUploadedDocument
    {
        public int id { get; set; }
        public string doc_name { get; set; }
        public int app_doc_id { get; set; }
        public int? service_document_id { get; set; }
        public bool? is_required { get; set; }
        public string type_name { get; set; }
        public string type_code { get; set; }
        public int? upload_id { get; set; }
        public string upload_name { get; set; }
        public DateTime? created_at { get; set; }
        public int? file_id { get; set; }
        public string file_name { get; set; }
        public int? created_by { get; set; }
        public bool? is_outcome { get; set; }
        public string? document_number { get; set; }
        public int? status_id { get; set; }
        public string status_name { get; set; }
        public List<FileSign> signs { get; set; }
        public List<WhoMustSignDoc> users { get; set; }

    }
    public class WhoMustSignDoc
    {
        public int id { get; set; }
        public int structure_id { get; set; }
        public string structure_name { get; set; }
        public int employee_id { get; set; }
        public int post_id { get; set; }
        public string post_name { get; set; }
        public bool signed { get; set; }
        public document_approval apprval { get; set; }
    }

    public class CopyUploadedDocumentDto
    {
        public int application_id { get; set; }
        public int? upl_id { get; set; }
        public int? service_document_id { get; set; }
        public int file_id { get; set; }
    }


    public class CustomAttachedDocument
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public int application_id { get; set; }
        public string number { get; set; }
        public string service_name { get; set; }
        public DateTime? created_at { get; set; }
        public string file_name { get; set; }
        public int service_document_id { get; set; }
        public bool? is_outcome { get; set; }
        public string? document_number { get; set; }

    }
    public class CustomAttachedOldDocument
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public int application_id { get; set; }
        public string number { get; set; }
        public string doc_name { get; set; }
        public string service_name { get; set; }
        public int application_document_id { get; set; }
        public DateTime? created_at { get; set; }
        public string file_name { get; set; }
        public int service_document_id { get; set; }
        public bool? is_outcome { get; set; }
        public string? document_number { get; set; }

    }
    
    public class UpdatedDocument
    {
        public int id { get; set; }
        public string status { get; set; } = null!;
        public string? document_name { get; set; }
        public string? file_name { get; set; }
        public int service_id { get; set; }
    }
}