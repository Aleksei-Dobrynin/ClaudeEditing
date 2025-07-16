using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Employee : BaseLogDomain
    {
        public int id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public string? full_name { get; set; }
        public string? pin { get; set; }
        public string? remote_id { get; set; }
        public string? user_id { get; set; }
        public string? email { get; set; }
        public string? telegram { get; set; }
        public int? uid { get; set; }
        public string guid { get; set; }
        public int structure_id { get; set; }
        public List<OrgStructure> head_of_structures { get; set; }
        public List<EmployeeInStructure> my_structures { get; set; }
        public List<int> post_ids { get; set; }
        public List<EmployeeInStructureHeadofStructures> dashboard_head_of_structures { get; set; }
        public List<DashboardStructures> dashboard_structures { get; set; }
        public List<DashboardServices> dashboard_services { get; set; }
        public int post_id { get; set; }
        public string post_name { get; set; }
        public string structure_name { get; set; }
        public bool release_read { get; set; }
    }

    public class EmployeeInitials
    {
        public int id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public string? pin { get; set; }
        }
}
