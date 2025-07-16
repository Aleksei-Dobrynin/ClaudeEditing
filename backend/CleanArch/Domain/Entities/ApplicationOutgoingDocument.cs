namespace Domain.Entities
{
    public class ApplicationOutgoingDocument
    {
       public int id { get; set; }
       public int application_id { get; set; }
       public string application_number { get; set; }
       public string outgoing_number { get; set; }
       public bool issued_to_customer { get; set; }
       public DateTime issued_at { get; set; }
       public bool signed_ecp { get; set; }
       public string signature_data { get; set; }
       public int journal_id { get; set; }
       public string journal_name { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }

    }
}