using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ApplicationDocument : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? name_kg { get; set; }
        public int document_type_id { get; set; }
        public string? document_type_name { get; set; }
        public string? description { get; set; }
        public string? law_description { get; set; }
        public bool? doc_is_outcome { get; set; }
    }
}
