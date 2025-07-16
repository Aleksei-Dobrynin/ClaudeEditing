using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createarchirecture_roadRequest
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public string rule_expression { get; set; }
		public string description { get; set; }
		public string validation_url { get; set; }
		public string post_function_url { get; set; }
		public bool? is_active { get; set; }
		public int from_status_id { get; set; }
		public int to_status_id { get; set; }
		public DateTime? created_at { get; set; }
		
    }
    public class Updatearchirecture_roadRequest
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public string rule_expression { get; set; }
        public string description { get; set; }
        public string validation_url { get; set; }
        public string post_function_url { get; set; }
        public bool? is_active { get; set; }
		public int from_status_id { get; set; }
		public int to_status_id { get; set; }
		public DateTime? created_at { get; set; }
		
    }
}