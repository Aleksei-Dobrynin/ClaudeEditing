using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Tag : BaseLogDomain
    {
        public int id { get; set; }
        public string name { get; set; }
        public string name_kg { get; set; }
        public string description { get; set; }
		public string code { get; set; }
    }
}