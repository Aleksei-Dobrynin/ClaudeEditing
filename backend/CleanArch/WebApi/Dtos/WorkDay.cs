using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkDayRequest
    {
        public int week_number { get; set; }
        public DateTime? time_start { get; set; }
        public DateTime? time_end { get; set; }
        public int schedule_id { get; set; }
    }

    public class UpdateWorkDayRequest
    {
        public int id { get; set; }
        public int week_number { get; set; }
        public DateTime? time_start { get; set; }
        public DateTime? time_end { get; set; }
        public int schedule_id { get; set; }
    }
}
