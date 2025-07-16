using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createstep_required_work_documentRequest
    {
        public int id { get; set; }
		public int step_id { get; set; }
		public int work_document_type_id { get; set; }
		public bool is_required { get; set; }
		public string description { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
    public class Updatestep_required_work_documentRequest
    {
        public int id { get; set; }
		public int step_id { get; set; }
		public int work_document_type_id { get; set; }
		public bool is_required { get; set; }
		public string description { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}