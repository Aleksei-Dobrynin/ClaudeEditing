using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class S_QueriesDocumentTemplateModel : BaseLogDomain
    {
        public int id { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idQuery { get; set; }
		
    }
}