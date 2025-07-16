using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class legal_act_registry
    {
        public int id { get; set; }
		public bool? is_active { get; set; }
		public string act_type { get; set; }
		public DateTime? date_issue { get; set; }
		public int id_status { get; set; }
		public string? statusName { get; set; }
        public string subject { get; set; }
		public string act_number { get; set; }
		public string decision { get; set; }
		public string addition { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
        public List<int> legalObjects { get; set; }
        public List<int>? assignees { get; set; }


    }
}