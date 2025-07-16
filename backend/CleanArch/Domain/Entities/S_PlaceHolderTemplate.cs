using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class S_PlaceHolderTemplate : BaseLogDomain
    {
        public int id { get; set; }
		public string name { get; set; }
		public string value { get; set; }
		public string code { get; set; }
		public int idQuery { get; set; }
		public int idPlaceholderType { get; set; }
		public S_PlaceHolderType S_PlaceHolderType { get; set; }


    }
}