
namespace Domain.Entities
{
    public class ApplicationPaidInvoice : BaseLogDomain
    {
        public int id { get; set; }
        public DateTime? date { get; set; }
        public string payment_identifier { get; set; }
        public decimal sum { get; set; }
        public string bank_identifier { get; set; }
        public int application_id { get; set; }
        public string? tax { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public bool? mbank { get; set; }
        public string? number { get; set; }
    }
    
    public class PaidInvoiceInfo
    {
        public int id { get; set; }
        public DateTime invoice_date { get; set; }
        public string application_number { get; set; }
        public int application_id { get; set; }
        public decimal invoice_sum { get; set; }
        public string payment_identifier { get; set; }
        public string customer_name { get; set; }
        public string object_address { get; set; }
        public string service_name { get; set; }
        public string payments_structure { get; set; }
        public decimal payments_sum { get; set; }
        public decimal paid_sum { get; set; }
        public int reestr_id { get; set; }
        public string reestr_name { get; set; }
    }
}
