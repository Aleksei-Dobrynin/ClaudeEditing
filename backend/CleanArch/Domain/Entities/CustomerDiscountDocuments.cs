namespace Domain.Entities
{
    public class CustomerDiscountDocuments
    {
       public int id { get; set; }
       public int customer_discount_id { get; set; }
       public int discount_documents_id { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
       public DateTime? start_date { get; set; }
       public DateTime? end_date { get; set; }
       public double? discount { get; set; }
       public string? file_name { get; set; }
       public string? discount_type_name { get; set; }
       public string? discount_document_name { get; set; }
    }
}