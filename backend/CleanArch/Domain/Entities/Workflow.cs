
namespace Domain.Entities
{
    public class Workflow : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public bool? is_active { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
    }
}