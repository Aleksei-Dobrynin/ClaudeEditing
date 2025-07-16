namespace WebApi.Dtos
{
    public class CreateJournalPlaceholderRequest
    {
        public int order_number { get; set; }
        public int template_id { get; set; }
        public int journal_id { get; set; }
    }

    public class UpdateJournalPlaceholderRequest
    {
        public int id { get; set; }
        public int order_number { get; set; }
        public int template_id { get; set; }
        public int journal_id { get; set; }
    }
}