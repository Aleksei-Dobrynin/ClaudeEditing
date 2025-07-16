using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class step_partnerModel
    {
        public int id { get; set; }
		public int? step_id { get; set; }
		public int? partner_id { get; set; }
		public string role { get; set; }
		public bool? is_required { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}