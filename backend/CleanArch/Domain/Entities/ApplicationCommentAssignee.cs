using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class ApplicationCommentAssignee : BaseLogDomain
    {
        public int id { get; set; }
        public int? application_id { get; set; }
        public int? comment_id { get; set; }
        public int? employee_id { get; set; }
        public bool? is_completed { get; set; }
        public DateTime? completed_date { get; set; }
    }
}
