using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createuploaded_application_documentRequest
    {
        public int id { get; set; }
		public int? file_id { get; set; }
		public int? app_step_id { get; set; }
		public int? application_document_id { get; set; }
		public string? name { get; set; }
		public int? service_document_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
        public FileModel? document { get; set; }
		public string? document_number { get; set; }
		public List<string>? app_docs { get; set; }
        public int? status_id { get; set; }

    }
    public class Updateuploaded_application_documentRequest
    {
        public int id { get; set; }
		public int? file_id { get; set; }
		public int? application_document_id { get; set; }
		public string name { get; set; }
		public int? service_document_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public string? document_number { get; set; }
        public List<string>? app_docs { get; set; }
        public int? status_id { get; set; }


    }
}