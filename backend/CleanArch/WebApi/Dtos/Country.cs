namespace WebApi.Dtos
{
    public class Country
    {
        public class CreateCountryRequest
        {
            public int id { get; set; }
            public string name { get; set; }
            public int description { get; set; }
            public string code { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public int? created_by { get; set; }
            public int? updated_by { get; set; }
            public string name_kg { get; set; }
            public string description_kg { get; set; }
            public string background_color { get; set; }
            public string icon_svg { get; set; }
            public bool is_default { get; set; }
            public string iso_code { get; set; }
        }
        public class UpdateCountryRequest
        {
            public int id { get; set; }
            public string name { get; set; }
            public int description { get; set; }
            public string code { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public int? created_by { get; set; }
            public int? updated_by { get; set; }
            public string name_kg { get; set; }
            public string description_kg { get; set; }
            public string background_color { get; set; }
            public string icon_svg { get; set; }
            public bool is_default { get; set; }
            public string iso_code { get; set; }
        }
    }
}
