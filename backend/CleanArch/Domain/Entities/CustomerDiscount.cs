namespace Domain.Entities
{
    public class CustomerDiscount
    {
       public int id { get; set; }
       public string pin_customer { get; set; }
       public string description { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
       public int active_discount_count { get; set; }
    }
}