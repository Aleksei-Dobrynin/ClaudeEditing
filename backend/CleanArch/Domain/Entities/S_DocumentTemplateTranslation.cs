using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class S_DocumentTemplateTranslation : BaseLogDomain
    {
        public int id { get; set; }
		public string? template { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idLanguage { get; set; }
		public string idLanguage_name { get; set; }

    }
}