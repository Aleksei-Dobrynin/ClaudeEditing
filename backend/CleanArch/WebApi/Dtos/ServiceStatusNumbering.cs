namespace WebApi.Dtos
{
    public class CreateServiceStatusNumberingRequest
    {
        public DateTime date_start { get; set; }
        public DateTime? date_end { get; set; }
        public bool is_active { get; set; }
        public int service_id { get; set; }
        public int journal_id { get; set; }
        public string number_template { get; set; }
    }

    public class UpdateServiceStatusNumberingRequest
    {
        public int id { get; set; }
        public DateTime date_start { get; set; }
        public DateTime date_end { get; set; }
        public bool is_active { get; set; }
        public int service_id { get; set; }
        public int journal_id { get; set; }
        public string number_template { get; set; }
    }
}