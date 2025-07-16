using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkScheduleExceptionRequest
    {
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public string name { get; set; }
        public int schedule_id { get; set; }
        public bool? is_holiday { get; set; }
        public DateTime? time_start { get; set; }
        public DateTime? time_end { get; set; }
    }

    public class UpdateWorkScheduleExceptionRequest
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
