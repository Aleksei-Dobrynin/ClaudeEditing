using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkDocumentTypeRequest
    {
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string metadata { get; set; }
    }

    public class UpdateWorkDocumentTypeRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string metadata { get; set; }
    }
}
