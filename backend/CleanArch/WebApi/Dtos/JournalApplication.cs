namespace WebApi.Dtos
{
    public class CreateJournalApplicationRequest
    {
        public int journal_id { get; set; }
        public int application_id { get; set; }
        public int application_status_id { get; set; }
        public string outgoing_number { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public int created_by { get; set; }
        public int updated_by { get; set; }

    }

    public class UpdateJournalApplicationRequest
    {
        public int id { get; set; }
        public int journal_id { get; set; }
        public int application_id { get; set; }
        public int application_status_id { get; set; }
        public string outgoing_number { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public int created_by { get; set; }
        public int updated_by { get; set; }

    }
}