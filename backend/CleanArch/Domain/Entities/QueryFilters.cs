namespace Domain.Entities
{
    public class QueryFilters
    {
       public int id { get; set; }
       public string name { get; set; }
       public string name_kg { get; set; }
       public string code { get; set; }
       public string description { get; set; }
       public string target_table { get; set; }
       public string query { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
    }
}