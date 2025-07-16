using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    internal class WorkScheduleModel : BaseLogDomain
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool? is_active { get; set; }
        public int year { get; set; }
    }
}
