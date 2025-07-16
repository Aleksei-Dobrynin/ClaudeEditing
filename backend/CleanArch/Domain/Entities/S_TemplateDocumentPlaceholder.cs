using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class S_TemplateDocumentPlaceholder : BaseLogDomain
    {
        public int id { get; set; }
		public int idTemplateDocument { get; set; }
		public int idPlaceholder { get; set; }
		
    }
}