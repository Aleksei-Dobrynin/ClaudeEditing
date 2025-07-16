using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateServiceRequest
    {
        public string? name { get; set; }
        public string? short_name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? day_count { get; set; }
        public int? workflow_id { get; set; }
        public int? law_document_id { get; set; }
        public decimal? price { get; set; }
        public bool? is_active { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int? structure_id { get; set; }
    }

    public class UpdateServiceRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? short_name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? day_count { get; set; }
        public int? workflow_id { get; set; }
        public int? law_document_id { get; set; }
        public decimal? price { get; set; }
        public bool? is_active { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int? structure_id { get; set; }
    }
}
