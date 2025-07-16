using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateS_QueriesDocumentTemplateRequest
    {
        public int id { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idQuery { get; set; }
		
    }
    public class UpdateS_QueriesDocumentTemplateRequest
    {
        public int id { get; set; }
		public int idDocumentTemplate { get; set; }
		public int idQuery { get; set; }
		
    }
}