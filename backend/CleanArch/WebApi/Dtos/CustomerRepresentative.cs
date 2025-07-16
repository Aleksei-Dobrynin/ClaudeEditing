using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateCustomerRepresentativeRequest
    {
        public int? customer_id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public DateTime? date_document { get; set; }
        public string? notary_number { get; set; }
        public string? requisites { get; set; }
        public string? pin { get; set; }
        public bool? is_included_to_agreement { get; set; }
        public string? contact { get; set; }
    }

    public class UpdateCustomerRepresentativeRequest
    {
        public int id { get; set; }
        public int? customer_id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public DateTime? date_document { get; set; }
        public string? notary_number { get; set; }
        public string? requisites { get; set; }
        public string? pin { get; set; }
        public bool? is_included_to_agreement { get; set; }
        public string? contact { get; set; }
    }
}
