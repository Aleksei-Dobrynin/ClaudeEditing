using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    internal class WorkScheduleExceptionModel : BaseLogDomain
    {
        public int id { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public string name { get; set; }
        public int schedule_id { get; set; }
        public bool? is_holiday { get; set; }
        public DateTime? time_start { get; set; }
        public DateTime? time_end { get; set; }
    }
}
