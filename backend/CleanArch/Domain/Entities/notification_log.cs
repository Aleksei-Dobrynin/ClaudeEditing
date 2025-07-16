using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class notification_log : BaseLogDomain
    {
        public int id { get; set; }
        public int? employee_id { get; set; }
        public int? user_id { get; set; }
        public string? user_name { get; set; }
        public string message { get; set; }
        public string? subject { get; set; }
        public string? guid { get; set; }
        public string? phone { get; set; }
        public DateTime? date_send { get; set; }
        public string type { get; set; }
        public int? application_id { get; set; }
        public string? application_number { get; set; }
        public int? customer_id { get; set; }
        public int? status_id { get; set; }
        public string? statusName {  get; set; }

    }
}