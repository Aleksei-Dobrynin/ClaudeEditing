
namespace Domain.Entities
{
    public class CustomerRepresentative : BaseLogDomain
    {
        public int id { get; set; }
        public int? customer_id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public string? notary_number { get; set; }
        public string? requisites { get; set; }
        public string? pin { get; set; }
        public string? contact { get; set; }
        public DateTime? date_document { get; set; }
        public bool? is_included_to_agreement { get; set; }
    }
}
