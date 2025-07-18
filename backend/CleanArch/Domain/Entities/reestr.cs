using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class reestr
    {
        public int id { get; set; }
		public string name { get; set; }
		public string status_name { get; set; }
		public string status_code { get; set; }
		public int? month { get; set; }
		public int? year { get; set; }
		public int status_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
    
    public class N8nValidationResult
    {
	    public bool Valid { get; set; }
	    public Dictionary<string, string>? Errors { get; set; }
    }
}