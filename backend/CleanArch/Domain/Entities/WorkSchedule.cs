using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class WorkSchedule : BaseLogDomain
    {
        public int id { get; set; }
        public int year { get; set; }
        public string name { get; set; }
        public bool? is_active { get; set; }
    }
}
