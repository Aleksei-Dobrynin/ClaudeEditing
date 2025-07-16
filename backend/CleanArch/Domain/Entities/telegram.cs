using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class telegram : BaseLogDomain
    {
        public int id { get; set; }
		public string chat_id { get; set; }
		public string username { get; set; }
		public string number { get; set; }
		
    }
}