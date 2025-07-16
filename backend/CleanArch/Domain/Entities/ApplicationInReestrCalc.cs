namespace Domain.Entities
{
    public class ApplicationInReestrCalc
    {
       public int id { get; set; }
       public int app_reestr_id { get; set; }
       public int structure_id { get; set; }
       public decimal sum { get; set; }
       public decimal total_sum { get; set; }
       public decimal total_payed { get; set; }
       public DateTime created_at { get; set; }
       public int created_by { get; set; }
       public DateTime updated_at { get; set; }
       public int updated_by { get; set; }

    }
}