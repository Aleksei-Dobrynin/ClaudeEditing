using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateS_TemplateDocumentPlaceholderRequest
    {
        public int id { get; set; }
		public int idTemplateDocument { get; set; }
		public int idPlaceholder { get; set; }
		
    }
    public class UpdateS_TemplateDocumentPlaceholderRequest
    {
        public int id { get; set; }
		public int idTemplateDocument { get; set; }
		public int idPlaceholder { get; set; }
		
    }
}