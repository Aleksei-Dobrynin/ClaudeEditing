using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createcontragent_interactionRequest
    {
        public int id { get; set; }
		public int? updated_by { get; set; }
		public int application_id { get; set; }
		public int? task_id { get; set; }
		public int contragent_id { get; set; }
		public string description { get; set; }
		public int? progress { get; set; }
		public string name { get; set; }
		public string? status { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		
    }
    public class Updatecontragent_interactionRequest
    {
        public int id { get; set; }
		public int? updated_by { get; set; }
		public int application_id { get; set; }
		public int? task_id { get; set; }
		public int contragent_id { get; set; }
		public string description { get; set; }
		public int? progress { get; set; }
		public string name { get; set; }
		public string? status { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		
    }
}