using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class S_TemplateDocumentPlaceholderModel : BaseLogDomain
    {
        public int id { get; set; }
		public int idTemplateDocument { get; set; }
		public int idPlaceholder { get; set; }
		
    }
}