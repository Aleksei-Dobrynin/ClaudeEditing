namespace Domain.Entities
{
    public class JournalPlaceholder
    {
       public int id { get; set; }
       public int order_number { get; set; }
       public int template_id { get; set; }
       public int journal_id { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
       public int? placeholder_id { get; set; }
       public string raw_value { get; set; }
       public string template_code { get; set; }

    }
}