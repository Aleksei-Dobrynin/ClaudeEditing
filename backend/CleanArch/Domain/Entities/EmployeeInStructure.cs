using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EmployeeInStructure : BaseLogDomain
    {
        public int id { get; set; }
        public int employee_id { get; set; }
        public string? employee_name { get; set; }
        public DateTime date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int structure_id { get; set; }
        public int post_id { get; set; }
        public string post_name { get; set; }
        public string post_code { get; set; }
        public string structure_name { get; set; }
        public bool? is_temporary { get; set; }
    }

    public class EmployeeInStructureHeadofStructures
    {
        public int id { get; set; }
        public string structure_name { get; set; }
    }

    public class DashboardStructures
    {
        public int id { get; set; }
        public string structure_name { get; set; }
    }

    public class DashboardServices
    {
        public int id { get; set; }
        public string service_name { get; set;}
    }
}
