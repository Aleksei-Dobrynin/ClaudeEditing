using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class release_seen
    {
        public int id { get; set; }
		public int release_id { get; set; }
		public int user_id { get; set; }
		public DateTime? date_issued { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}