using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateS_DocumentTemplateTranslationRequest
    {
        public int id { get; set; }
		public string template { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idLanguage { get; set; }
		
    }
    public class UpdateS_DocumentTemplateTranslationRequest
    {
        public int id { get; set; }
		public string template { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idLanguage { get; set; }
		
    }
}