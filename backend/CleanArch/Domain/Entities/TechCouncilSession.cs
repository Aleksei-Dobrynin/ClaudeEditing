namespace Domain.Entities
{
    public class TechCouncilSession
    {
       public int id { get; set; }
       public DateTime date { get; set; }
       public bool is_active { get; set; }
       public string? document { get; set; }
       public DateTime created_at { get; set; }
       public int created_by { get; set; }
       public DateTime updated_at { get; set; }
       public int updated_by { get; set; }
       public int count_tech_council_case { get; set; }
       public int count_tech_council_department { get; set; }
    }
}