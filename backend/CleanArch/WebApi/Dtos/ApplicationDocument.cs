using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateApplicationDocumentRequest
    {
        public string? name { get; set; }
        public int document_type_id { get; set; }
        public string? description { get; set; }
        public string? law_description { get; set; }
        public bool? doc_is_outcome { get; set; }
    }

    public class UpdateApplicationDocumentRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public int document_type_id { get; set; }
        public string? description { get; set; }
        public string? law_description { get; set; }
        public bool? doc_is_outcome { get; set; }
    }
}
