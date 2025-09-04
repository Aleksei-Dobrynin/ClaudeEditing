namespace Domain.Entities
{
    public class TundukData
    {
        public int id { get; set; }
        public string name { get; set; }
        public string name_kg { get; set; }
        public int streetId { get; set; }
        public int? type { get; set; }
        public string code { get; set; }
        public string address_unit_name { get; set; }
        public int? address_unit_id { get; set; }
    }
    
    public class TundukSearchAddressResponse
    {
        public List<TundukSearchAddress> list { get; set; }
        public int totalCount { get; set; }
    }

    public class TundukSearchAddress
    {
        public int propaddress_id { get; set; }
        public string code { get; set; }
        public string address { get; set; }
        public int? index { get; set; }
        public int? id { get; set; }
    }
    
    public class TundukAteStreets
    {
        public int id { get; set; }
        public int streetId { get; set; }
        public int street_type { get; set; }
        public string? code { get; set; }
        public string name { get; set; }
        public string nameKg { get; set; }
        public bool expired { get; set; }
    }
    
    public class TundukAteChildren
    {
        public List<Child> child { get; set; }
        public AteH ateH { get; set; }
        public bool anketa { get; set; }
        public Header header { get; set; }
    }

    public class Child
    {
        public int id { get; set; }
        public string value { get; set; }
        public string valueKg { get; set; }
        public int type { get; set; }
        public string code { get; set; }
    }

    public class AteH
    {
        public int type { get; set; }
    }

    public class Header
    {
        public int id { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string fio { get; set; }
        public string phone { get; set; }
        public string head_municipality { get; set; }
        public string head_municipality_phone { get; set; }
    }

}
