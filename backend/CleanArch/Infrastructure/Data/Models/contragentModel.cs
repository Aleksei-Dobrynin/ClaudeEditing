using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class contragentModel : BaseLogDomain
    {
        public int id { get; set; }
		public string name { get; set; }
		public string address { get; set; }
		public string contacts { get; set; }
		public string user_id { get; set; }
    }
}