using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class structure_application_logModel : BaseLogDomain
    {
        public int id { get; set; }
		public int? structure_id { get; set; }
		public int? application_id { get; set; }
		public string status { get; set; }
		public string status_code { get; set; }
		
    }
}