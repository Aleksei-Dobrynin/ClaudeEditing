using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_legal_recordRequest
    {
        public int id { get; set; }
		public int id_application { get; set; }
		public int? id_legalrecord { get; set; }
		public int? id_legalact { get; set; }
		//public DateTime? created_at { get; set; }
		//public DateTime? updated_at { get; set; }
		//public int? created_by { get; set; }
		//public int? updated_by { get; set; }
		
    }
    public class Updateapplication_legal_recordRequest
    {
        public int id { get; set; }
		public int id_application { get; set; }
		public int? id_legalrecord { get; set; }
		public int? id_legalact { get; set; }
		//public DateTime? created_at { get; set; }
		//public DateTime? updated_at { get; set; }
		//public int? created_by { get; set; }
		//public int? updated_by { get; set; }
		
    }
}