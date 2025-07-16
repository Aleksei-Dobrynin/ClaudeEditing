namespace Domain.Entities
{
    public class JournalApplication
    {
       public int id { get; set; }
       public int journal_id { get; set; }
       public string journal_name { get; set; }
       public int application_id { get; set; }
       public string application_number { get; set; }
       public string status_name { get; set; }
       public string service_name { get; set; }
       public string arch_object_address { get; set; }
       public string customer_name { get; set; }
       public DateTime registration_date { get; set; }
       public DateTime deadline { get; set; }
       public int application_status_id { get; set; }
       public string application_status_name { get; set; }
       public string outgoing_number { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }

    }
}