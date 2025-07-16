using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class TagModel : BaseLogDomain
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		
    }
}