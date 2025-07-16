using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class S_QueriesDocumentTemplate : BaseLogDomain
    {
        public int id { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idQuery { get; set; }
		
    }
}