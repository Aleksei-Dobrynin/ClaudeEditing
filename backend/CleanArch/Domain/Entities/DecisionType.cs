namespace Domain.Entities
{
    public class DecisionType
    {
       public int id { get; set; }
       public string name { get; set; }
       public string code { get; set; }
       public string description { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
    }
}