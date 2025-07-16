
namespace WebApi.Dtos
{
    public class CreateApplicationOutgoingDocumentRequest
    {
        public int application_id { get; set; }
        public string outgoing_number { get; set; }
        public bool issued_to_customer { get; set; }
        public DateTime issued_at { get; set; }
        public bool signed_ecp { get; set; }
        public string signature_data { get; set; }
        public int journal_id { get; set; }
    }
    
    public class UpdateApplicationOutgoingDocumentRequest
    {
        public int id { get; set; }
        public int application_id { get; set; }
        public string outgoing_number { get; set; }
        public bool issued_to_customer { get; set; }
        public DateTime issued_at { get; set; }
        public bool signed_ecp { get; set; }
        public string signature_data { get; set; }
        public int journal_id { get; set; }
    }
}