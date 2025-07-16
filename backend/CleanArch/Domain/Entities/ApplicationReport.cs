
namespace Domain.Entities
{
    public class ApplicationReport
    {
        public int id { get; set; }
        public int order_number { get; set; }
        public string? number { get; set; }
        public DateTime? registration_date { get; set; }
        public string customer_name { get; set; }
        public string? arch_object_name { get; set; }
        public string? price { get; set; }
        public string? nds { get; set; }
        public string? nsp { get; set; }
        public string? sum { get; set; }
    }
}
