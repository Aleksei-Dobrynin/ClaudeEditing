using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class application_subtask_assigneeModel : BaseLogDomain
    {
        public int id { get; set; }
		public int structure_employee_id { get; set; }
		public int application_subtask_id { get; set; }
    }
}