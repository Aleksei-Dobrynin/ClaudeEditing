namespace WebApi.Dtos
{
    public class CreateApplicationRoadRequest
    {
        public int? from_status_id { get; set; }
        public int? to_status_id { get; set; }
        public string? rule_expression { get; set; }
        public string? description { get; set; }
        public string? validation_url { get; set; }
        public string? post_function_url { get; set; }
        public bool? is_active { get; set; }
        public int[]? posts { get; set; }
        public int? group_id { get; set; }
    }
    
    public class UpdateApplicationRoadRequest
    {
        public int id { get; set; }
        public int? from_status_id { get; set; }
        public int? to_status_id { get; set; }
        public string? rule_expression { get; set; }
        public string? description { get; set; }
        public string? validation_url { get; set; }
        public string? post_function_url { get; set; }
        public bool? is_active { get; set; }
        public int[]? posts { get; set; }
        public int? group_id { get; set; }
    }
}
