using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class saved_application_documentModel : BaseLogDomain
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public int template_id { get; set; }
		public int? file_id { get; set; }
		public int language_id { get; set; }
		public string body { get; set; }
    }
}