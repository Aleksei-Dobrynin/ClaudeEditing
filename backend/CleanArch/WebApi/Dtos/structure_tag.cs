using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createstructure_tagRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int structure_id { get; set; }
		
    }
    public class Updatestructure_tagRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int structure_id { get; set; }
		
    }
}