namespace Domain.Entities
{
    public class HistoryTable
    {
        public int id { get; set; }
        public int? entity_id { get; set; }
        public string? operation { get; set; }
        public string? old_value { get; set; }
        public string? new_value { get; set; }
        public string? action_description { get; set; }
        public string? field { get; set; }
        public DateTime? created_at { get; set; }
        public int? created_by { get; set; }
        public string? created_by_name { get; set; }
        public string? entity_type { get; set; }
    }
}
