namespace WebApi.Dtos
{
    public class CreateJournalTemplateTypeRequest
    {
        public string code { get; set; }
        public string name { get; set; }
        public string? raw_value { get; set; }
        public int? placeholder_id { get; set; }
        public string example { get; set; }
    }

    public class UpdateJournalTemplateTypeRequest
    {
        public int id { get; set; }
        public string code { get; set; }
        public string name { get; set; }
        public string? raw_value { get; set; }
        public int? placeholder_id { get; set; }
        public string example { get; set; }
    }
}