
namespace WebApi.Dtos
{
    public class CreateCustomerRequest
    {
        public int id { get; set; }
        public string? pin { get; set; }
        public bool? is_organization { get; set; }
        public string? full_name { get; set; }
        public string? address { get; set; }
        public string? director { get; set; }
        public string? okpo { get; set; }
        public int? organization_type_id { get; set; }
        public string? payment_account { get; set; }
        public string? postal_code { get; set; }
        public string? ugns { get; set; }
        public string? bank { get; set; }
        public string? bik { get; set; }
        public string? registration_number { get; set; }
        public string? individual_name { get; set; }
        public string? individual_secondname { get; set; }
        public string? individual_surname { get; set; }
        public int? identity_document_type_id { get; set; }
        public string? document_serie { get; set; }
        public DateTime? document_date_issue { get; set; }
        public string? document_whom_issued { get; set; }
        public string? sms_1 {get; set;}
        public string? sms_2 {get; set;}
        public string? email_1 {get; set;}
        public string? email_2 {get; set;}
        public string? telegram_1 {get; set;}
        public string? telegram_2 {get; set;}
        public List<Domain.Entities.CustomerRepresentative> customerRepresentatives { get; set; }
        public bool? is_foreign { get; set; }
        public int? foreign_country { get; set; }
    }

    public class UpdateCustomerRequest
    {
        public int id { get; set; }
        public string? pin { get; set; }
        public bool? is_organization { get; set; }
        public string? full_name { get; set; }
        public string? address { get; set; }
        public string? director { get; set; }
        public string? okpo { get; set; }
        public int? organization_type_id { get; set; }
        public string? payment_account { get; set; }
        public string? postal_code { get; set; }
        public string? ugns { get; set; }
        public string? bank { get; set; }
        public string? bik { get; set; }
        public string? registration_number { get; set; }
        public string? individual_name { get; set; }
        public string? individual_secondname { get; set; }
        public string? individual_surname { get; set; }
        public int? identity_document_type_id { get; set; }
        public string? document_serie { get; set; }
        public DateTime? document_date_issue { get; set; }
        public string? document_whom_issued { get; set; }
        public bool? is_foreign { get; set; }
        public int? foreign_country { get; set; }
    }
}
