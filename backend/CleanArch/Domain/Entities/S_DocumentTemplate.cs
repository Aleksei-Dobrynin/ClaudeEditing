using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class S_DocumentTemplate : BaseLogDomain
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public int? idCustomSvgIcon { get; set; }
		public string iconColor { get; set; }
		public int idDocumentType { get; set; }
        public List<int> orgStructures { get; set; }
        public string text_color { get; set; }
        public string name_kg { get; set; }
        public string description_kg { get; set; }
        public string background_color { get; set; }
        public S_DocumentTemplateTranslation S_DocumentTemplateTranslation { get; set; }
		public List<S_DocumentTemplateTranslation> translations { get; set; }
		public List<SavedApplicationDocument>? saved_application_documents { get; set; }
    }
    public class S_DocumentTemplateWithLanguage
    {
        public int id { get; set; }
        public string name { get; set; }
        public int idLanguage { get; set; }
        public string language_code { get; set; }
        public int template_id { get; set; }
        public string language { get; set; }
        public string template { get; set; }

    }
    
    public class SavedApplicationDocument
    {
	    public int? id { get; set; }
	    public int? language_id { get; set; }
	    public int? file_id { get; set; }
        public DateTime? created_at { get; set; }
    }

    public class ApplicationCustomerIsOrganization
    {
        public int? id { get; set; }
        public string customer_pin { get; set; }
        public bool is_organization { get; set; }
    }
    public class GetFilledReportRequest
    {
        public int template_id { get; set; }
        public int year { get; set; }
        public string filter_type { get; set; }
        public int month { get; set; }
        public int kvartal { get; set; }
        public int polgoda { get; set; }
        public string language { get; set; }

    }
}