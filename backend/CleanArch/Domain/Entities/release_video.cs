using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class release_video
    {
        public int id { get; set; }
		public int release_id { get; set; }
		public int file_id { get; set; }
		public string? file_name { get; set; }
        public string name { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}