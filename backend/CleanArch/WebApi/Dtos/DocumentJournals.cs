using Domain.Entities;

namespace WebApi.Dtos
{
    public class CreateDocumentJournalsRequest
    {
        public string code { get; set; }
        public string name { get; set; }
        public string? number_template { get; set; }
        public int? current_number { get; set; }
        public string? reset_period { get; set; }
        public DateTime? last_reset { get; set; }
        public List<TemplateTypeOrderDto> template_types { get; set; }
        public int? period_type_id { get; set; }
        public int[] status_ids { get; set; }
    }

    public class UpdateDocumentJournalsRequest
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string? number_template { get; set; }
        public int? current_number { get; set; }
        public string? reset_period { get; set; }
        public DateTime? last_reset { get; set; }
        public List<TemplateTypeOrderDto> template_types { get; set; }
        public int? period_type_id { get; set; }
        public int[] status_ids { get; set; }
    }
}