namespace Domain.Entities
{
    public class ApplicationStatus : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? name_kg { get; set; }
        public string? description { get; set; }
        public string? code { get; set; }
        public string? status_color { get; set; }
    }
}
