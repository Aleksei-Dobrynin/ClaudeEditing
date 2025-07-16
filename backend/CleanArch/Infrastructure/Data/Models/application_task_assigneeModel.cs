using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class application_task_assigneeModel : BaseLogDomain
    {
        public int id { get; set; }
		public int structure_employee_id { get; set; }
		public int application_task_id { get; set; }
    }
}