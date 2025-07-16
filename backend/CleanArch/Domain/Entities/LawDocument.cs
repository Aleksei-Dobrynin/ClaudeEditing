namespace Domain.Entities
{
    public class LawDocument
    {
       public int id { get; set; }
       public string name { get; set; }
       public DateTime data { get; set; }
       public string description { get; set; }
       public int type_id { get; set; }
       public string type_name { get; set; }
       public string link { get; set; }
       public string name_kg { get; set; }
       public string description_kg { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }

    }
}