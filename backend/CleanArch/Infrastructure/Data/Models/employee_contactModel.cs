using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class employee_contactModel : BaseLogDomain
    {
        public int id { get; set; }
		public string value { get; set; }
		public int? employee_id { get; set; }
		public int? type_id { get; set; }
		public bool? allow_notification { get; set; }
		
    }
}