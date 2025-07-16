using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RepeatType : BaseLogDomain
    {
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public int? repeatIntervalMinutes { get; set; }
        public bool? isPeriod { get; set; }

        public int id { get; set; }
    }
}
