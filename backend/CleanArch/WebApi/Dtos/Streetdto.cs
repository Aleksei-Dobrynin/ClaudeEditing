namespace WebApi.Dtos
{
    public class CreateStreetRequest
    {
        public string? name { get; set; }
        public string? description { get; set; }
        public string? code { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public string? name_kg { get; set; }
        public string? description_kg { get; set; }
        public bool? expired { get; set; }
        public int? street_type_id { get; set; }
        public int? address_unit_id { get; set; }
        public int? remote_id { get; set; }
    }

    public class UpdateStreetRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public string? code { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public string? name_kg { get; set; }
        public string? description_kg { get; set; }
        public bool? expired { get; set; }
        public int? street_type_id { get; set; }
        public int? address_unit_id { get; set; }
        public int? remote_id { get; set; }
    }
}