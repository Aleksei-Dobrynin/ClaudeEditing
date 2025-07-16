using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createservice_pathRequest
    {
        public int id { get; set; }
		public int? updated_by { get; set; }
		public int? service_id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public bool? is_default { get; set; }
		public bool? is_active { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		
    }
    public class Updateservice_pathRequest
    {
        public int id { get; set; }
		public int? updated_by { get; set; }
		public int? service_id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public bool? is_default { get; set; }
		public bool? is_active { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		
    }
}