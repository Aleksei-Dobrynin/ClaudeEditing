using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createlegal_record_objectRequest
    {
        public int id { get; set; }
		//public DateTime? created_at { get; set; }
		//public DateTime? updated_at { get; set; }
		//public int? created_by { get; set; }
		//public int? updated_by { get; set; }
		public int id_record { get; set; }
		public int id_object { get; set; }
		
    }
    public class Updatelegal_record_objectRequest
    {
        public int id { get; set; }
		//public DateTime? created_at { get; set; }
		//public DateTime? updated_at { get; set; }
		//public int? created_by { get; set; }
		//public int? updated_by { get; set; }
		public int id_record { get; set; }
		public int id_object { get; set; }
		
    }
}