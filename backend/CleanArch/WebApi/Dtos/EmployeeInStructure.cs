using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateEmployeeInStructureRequest
    {
        public int employee_id { get; set; }
        public DateTime date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int structure_id { get; set; }
        public int post_id { get; set; }
        public bool? is_temporary { get; set; }
    }

    public class UpdateEmployeeInStructureRequest
    {
        public int id { get; set; }
        public int employee_id { get; set; }
        public DateTime date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int structure_id { get; set; }
        public int post_id { get; set; }
        public bool? is_temporary { get; set; }
    }
}
