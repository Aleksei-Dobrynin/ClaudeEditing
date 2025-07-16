using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createstep_dependencyRequest
    {
        public int id { get; set; }
        public int? dependent_step_id { get; set; }
        public int? prerequisite_step_id { get; set; }
        public bool? is_strict { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }

    }
    public class Updatestep_dependencyRequest
    {
        public int id { get; set; }
        public int? dependent_step_id { get; set; }
        public int? prerequisite_step_id { get; set; }
        public bool? is_strict { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }

    }

    public class FilterStepDependencyRequest
    {
        public int service_path_id { get; set; }
    }
}