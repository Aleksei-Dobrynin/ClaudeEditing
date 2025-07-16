using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class S_DocumentTemplateTranslationModel : BaseLogDomain
    {
        public int id { get; set; }
		public string template { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idLanguage { get; set; }
		
    }
}