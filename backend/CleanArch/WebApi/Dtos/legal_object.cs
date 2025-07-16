using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createlegal_objectRequest
    {
		public string? description { get; set; }
		public string? address { get; set; }
		public string? geojson { get; set; }
		//public DateTime? created_at { get; set; }
		//public DateTime? updated_at { get; set; }
		//public int? created_by { get; set; }
		//public int? updated_by { get; set; }
		
    }
    public class Updatelegal_objectRequest
    {
        public int id { get; set; }
		public string? description { get; set; }
		public string? address { get; set; }
		public string? geojson { get; set; }
		//public DateTime? created_at { get; set; }
		//public DateTime? updated_at { get; set; }
		//public int? created_by { get; set; }
		//public int? updated_by { get; set; }
		
    }
}