using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class IntervalForSchedule
    {
        public int id { get; set; }
        public int idSchedule { get; set; }
        public int idRepeatType { get; set; }
    }
}
