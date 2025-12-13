
namespace Domain.Entities
{
    public class Customer : BaseLogDomain
    {
        public int id { get; set; }
        public string? pin { get; set; }
        public bool? is_organization { get; set; }
        public string? _full_name { get; set; }
        public string? full_name
        {
            get
            {
                if(is_organization != true)
                {
                    return individual_surname + " " + individual_name + " " + individual_secondname;
                }
                return _full_name;
            }
            set
            {
                this._full_name = value;
            }
        }
        public string? address { get; set; }
        public string? director { get; set; }
        public string? okpo { get; set; }
        public int? organization_type_id { get; set; }
        public string? organization_type_name { get; set; }
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
        public List<CustomerRepresentative> customerRepresentatives { get; set; }
        public bool? is_foreign { get; set; }
        public int? foreign_country { get; set; }
        
                
    }
    
    public class CompanyInfo
    {
        public string fullNameGl { get; set; }

        public string shortNameGl { get; set; }

        public string fullNameOl { get; set; }

        public string shortNameOl { get; set; }

        public bool foreignPart { get; set; }

        public string registrCode { get; set; }

        public string statSubCode { get; set; }

        public string tin { get; set; }

        public string region { get; set; }

        public string district { get; set; }

        public string city { get; set; }

        public string village { get; set; }

        public string microdistrict { get; set; }

        public string street { get; set; }

        public string house { get; set; }

        public string room { get; set; }

        public string phones { get; set; }

        public string email1 { get; set; }

        public string email2 { get; set; }

        public DateTime? orderDate { get; set; }

        public string firstOrderDate { get; set; }

        public int category { get; set; }
        public int categorySystemId { get; set; }
        public string categorySystemName { get; set; }

        public int ownership { get; set; }

        public string chief { get; set; }

        public string chiefTin { get; set; }

        public string baseBus { get; set; }

        public string baseBusCode { get; set; }

        public string indFounders { get; set; }

        public string jurFounders { get; set; }

        public string totalFounders { get; set; }

        public string description { get; set; }
        
        public string founders { get; set; }
    }
}
