using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class S_QueryModel : BaseLogDomain
    {
        public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string query { get; set; }
		public int id { get; set; }
		
    }
}