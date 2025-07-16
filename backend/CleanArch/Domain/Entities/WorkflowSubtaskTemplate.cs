
namespace Domain.Entities
{
    public class WorkflowSubtaskTemplate : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public int? workflow_task_id { get; set; }
        public int? type_id { get; set; }
        public string type_name { get; set; }
    }
}