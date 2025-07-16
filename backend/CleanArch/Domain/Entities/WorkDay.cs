using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class WorkDay : BaseLogDomain
    {
        public int id { get; set; }
        public int week_number { get; set; }
        public DateTime? time_start { get; set; }
        public DateTime? time_end { get; set; }
        public int schedule_id { get; set; }
    }
}
