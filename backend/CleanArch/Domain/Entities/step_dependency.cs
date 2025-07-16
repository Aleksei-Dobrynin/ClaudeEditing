using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class step_dependency
    {
        public int id { get; set; }
        public int? dependent_step_id { get; set; }
        public string? dependent_step_name { get; set; }
        public int? prerequisite_step_id { get; set; }
        public string? prerequisite_step_name { get; set; }
        public bool? is_strict { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }

    }
}