namespace Domain.Entities
{
    public class JournalTemplateType
    {
       public int id { get; set; }
       public string code { get; set; }
       public string name { get; set; }
       public string? raw_value { get; set; }
       public int? placeholder_id { get; set; }
       public string? placeholder_name { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
       public string example { get; set; }

    }
}