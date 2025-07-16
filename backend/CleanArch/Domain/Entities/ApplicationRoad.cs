using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class ApplicationRoad : BaseLogDomain
    {
        public int id { get; set; }
        public int? from_status_id { get; set; }
        public string? from_status_name { get; set; }
        public int? to_status_id { get; set; }
        public string? to_status_name { get; set; }
        public string? rule_expression { get; set; }
        public string? description { get; set; }
        public string? validation_url { get; set; }
        public string? post_function_url { get; set; }
        public bool? is_active { get; set; }
        public int? group_id { get; set; }
        public string? group_name { get; set; }
        public string? roles { get; set; }
        public bool? is_allowed { get; set; }
        public int[]? posts { get; set; }
    }
}
