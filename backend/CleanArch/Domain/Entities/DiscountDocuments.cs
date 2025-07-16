namespace Domain.Entities
{
    public class DiscountDocuments
    {
       public int id { get; set; }
       public int file_id { get; set; }
       public string description { get; set; }
       public double discount { get; set; }
       public int discount_type_id { get; set; }
       public int document_type_id { get; set; }
       public DateTime start_date { get; set; }
       public DateTime end_date { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
       public File document { get; set; }
       public string file_name { get; set; }
       public string discount_type_name { get; set; }
       public string document_type_name { get; set; }
    }
}