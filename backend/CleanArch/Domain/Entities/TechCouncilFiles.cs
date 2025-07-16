namespace Domain.Entities
{
    public class TechCouncilFiles
    {
       public int id { get; set; }
       public int tech_council_id { get; set; }
       public int file_id { get; set; }
       public string file_name { get; set; }
       public DateTime created_at { get; set; }
       public DateTime updated_at { get; set; }
       public int created_by { get; set; }
       public int updated_by { get; set; }

    }
}