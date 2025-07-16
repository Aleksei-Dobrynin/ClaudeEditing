namespace Domain.Entities
{
    public class WorkflowTaskTemplate : BaseLogDomain
    {
        public int id { get; set; }
        public int? workflow_id { get; set; }
        public string? name { get; set; }
        public int? order { get; set; }
        public bool? is_active { get; set; }
        public bool? is_required { get; set; }
        public string? description { get; set; }
        public int? structure_id { get; set; }
        public string? structure_name { get; set; }
        public int? type_id { get; set; }
        public string type_name { get; set; }
    }
}