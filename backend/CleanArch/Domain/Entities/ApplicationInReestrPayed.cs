namespace Domain.Entities
{
    public class ApplicationInReestrPayed
    {
       public int id { get; set; }
       public int app_reestr_id { get; set; }
       public DateTime date { get; set; }
       public decimal sum { get; set; }
       public string payment_identifier { get; set; }
       public DateTime created_at { get; set; }
       public int created_by { get; set; }
       public DateTime updated_at { get; set; }
       public int updated_by { get; set; }

    }
}