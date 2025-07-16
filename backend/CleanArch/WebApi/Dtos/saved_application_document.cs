using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createsaved_application_documentRequest
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int template_id { get; set; }
		public int language_id { get; set; }
		public string body { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? file_id { get; set; }
		
    }
    public class Updatesaved_application_documentRequest
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int template_id { get; set; }
		public int language_id { get; set; }
		public string body { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? file_id { get; set; }
		
    }
}