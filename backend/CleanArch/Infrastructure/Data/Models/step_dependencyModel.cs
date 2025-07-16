using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class step_dependencyModel
    {
        public int id { get; set; }
		public int? dependent_step_id { get; set; }
		public int? prerequisite_step_id { get; set; }
		public bool? is_strict { get; set; }
		
    }
}