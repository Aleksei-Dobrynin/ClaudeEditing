using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateEmployeeEventRequest
    {
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int? event_type_id { get; set; }
        public int? employee_id { get; set; }
        public int? temporary_employee_id { get; set; }
        
    }

    public class UpdateEmployeeEventRequest
    {
        public int id { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int? event_type_id { get; set; }
        public int? employee_id { get; set; }
        public int? temporary_employee_id { get; set; }
    }
}
