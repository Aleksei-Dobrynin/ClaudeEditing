using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkScheduleRequest
    {
        public string name { get; set; }
        public bool? is_active { get; set; }
        public int year { get; set; }
    }

    public class UpdateWorkScheduleRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool? is_active { get; set; }
        public int year { get; set; }
    }
}
