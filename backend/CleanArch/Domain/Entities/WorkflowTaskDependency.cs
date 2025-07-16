
namespace Domain.Entities
{
    public class WorkflowTaskDependency : BaseLogDomain
    {
        public int id { get; set; }
        public int? task_id { get; set; }
        public int? dependent_task_id { get; set; }
    }
}