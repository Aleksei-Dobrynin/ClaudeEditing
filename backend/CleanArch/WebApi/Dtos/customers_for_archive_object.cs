namespace WebApi.Dtos
{
    public class Createcustomers_for_archive_objectRequest
    {
        public string? full_name { get; set; }
        public string? pin { get; set; }
        public string? address { get; set; }
        public bool? is_organization { get; set; }
        public string? description { get; set; }
        public string? dp_outgoing_number { get; set; }
    }

    public class Updatecustomers_for_archive_objectRequest
    {
        public int id { get; set; }
        public string? full_name { get; set; }
        public string? pin { get; set; }
        public string? address { get; set; }
        public bool? is_organization { get; set; }
        public string? description { get; set; }
        public string? dp_outgoing_number { get; set; }
    }
}
