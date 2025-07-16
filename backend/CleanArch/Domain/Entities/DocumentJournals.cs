namespace Domain.Entities
{
    public class DocumentJournals
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string? number_template { get; set; }
        public int? current_number { get; set; }
        public string? reset_period { get; set; }
        public DateTime? last_reset { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public List<TemplateTypeOrderDto> template_types { get; set; }
        public int? period_type_id { get; set; }
        public string? period_type_name { get; set; }
        public int[] status_ids { get; set; }
        public string status_names { get; set; }

    }

    public class JournalAppStatus
    {
        public int id { get; set; }
        public int? journal_id { get; set; }
        public int? status_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }

    public class TemplateTypeOrderDto
    {
        public int id { get; set; }
        public int order { get; set; }
    }
}