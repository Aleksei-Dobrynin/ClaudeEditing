using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreatecontragentRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string address { get; set; }
		public string contacts { get; set; }
		public string user_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
    public class UpdatecontragentRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string address { get; set; }
		public string contacts { get; set; }
		public string user_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}