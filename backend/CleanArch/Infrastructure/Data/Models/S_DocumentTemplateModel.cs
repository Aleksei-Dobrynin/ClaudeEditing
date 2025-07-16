using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class S_DocumentTemplateModel : BaseLogDomain
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public int? idCustomSvgIcon { get; set; }
		public string iconColor { get; set; }
		public int idDocumentType { get; set; }
		
    }
}