using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateS_DocumentTemplateRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		//public int? idCustomSvgIcon { get; set; }
		//public string iconColor { get; set; }
		public int idDocumentType { get; set; }
		public List<int> orgStructures { get; set; }
        public List<S_DocumentTemplateTranslation> translations { get; set; }

    }
    public class UpdateS_DocumentTemplateRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		//public int? idCustomSvgIcon { get; set; }
		//public string iconColor { get; set; }
		public int idDocumentType { get; set; }
        public List<int> orgStructures { get; set; }
        public List<S_DocumentTemplateTranslation> translations { get; set; }

    }
}