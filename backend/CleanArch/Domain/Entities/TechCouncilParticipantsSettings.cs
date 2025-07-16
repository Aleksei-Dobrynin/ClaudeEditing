namespace Domain.Entities
{
    public class TechCouncilParticipantsSettings
    {
       public int id { get; set; }
       public int structure_id { get; set; }
       public int service_id { get; set; }
       public bool is_active { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }
       public string structure_name { get; set; }
    }
}