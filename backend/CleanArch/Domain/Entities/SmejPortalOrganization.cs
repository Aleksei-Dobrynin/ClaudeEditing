namespace Domain.Entities
{
    public class SmejPortalOrganization
    {
        public int id { get; set; }
        public string organization_code { get; set; }
        public string name { get; set; }
        public string short_name { get; set; }
        public string organization_type { get; set; }
        public string inn { get; set; }
        public string address { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public bool? is_active { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }
}