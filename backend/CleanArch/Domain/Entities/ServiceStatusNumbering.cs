namespace Domain.Entities
{
    public class ServiceStatusNumbering
    {
       public int id { get; set; }
       public DateTime date_start { get; set; }
       public DateTime? date_end { get; set; }
       public bool is_active { get; set; }
       public int service_id { get; set; }
       public int journal_id { get; set; }
       public string journal_name { get; set; }
       public string service_name { get; set; }
       public string number_template { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }

    }
}