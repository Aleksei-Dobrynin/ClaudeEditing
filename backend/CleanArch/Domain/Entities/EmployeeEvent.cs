using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EmployeeEvent : BaseLogDomain
    {
        public int id { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int? event_type_id { get; set; }
        public string? event_type_name { get; set; }
        public int? employee_id { get; set; }
        public int? temporary_employee_id { get; set; }
    }
}
