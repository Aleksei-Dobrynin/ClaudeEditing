using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class contragent_interactionModel : BaseLogDomain
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int? task_id { get; set; }
		public int contragent_id { get; set; }
		public string description { get; set; }
		public int? progress { get; set; }
		public string name { get; set; }
		public string status { get; set; }
    }
}