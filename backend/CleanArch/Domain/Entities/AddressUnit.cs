namespace Domain.Entities
{
    public class AddressUnit : BaseLogDomain
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public string name_kg { get; set; }
        public string description_kg { get; set; }
        public int? type_id { get; set; }
        public string? type_name { get; set; }
        public bool? expired { get; set; }
        public int? remote_id { get; set; }
        public int? parent_id { get; set; }
        public string? parent_name { get; set; }
    }
}