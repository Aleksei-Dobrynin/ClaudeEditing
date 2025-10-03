namespace WebApi.Dtos
{
    public class CreateArchiveObjectsEventsRequest
    {
        public string description { get; set; }
        public int? employee_id { get; set; }
        public int? head_structure_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? archive_object_id { get; set; }
        public int? event_type_id { get; set; }
        public DateTime? event_date { get; set; }
        public int? structure_id { get; set; }
        public int? application_id { get; set; }
    }

    public class UpdateArchiveObjectsEventsRequest
    {
        public int id { get; set; }
        public string description { get; set; }
        public int? employee_id { get; set; }
        public int? head_structure_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? archive_object_id { get; set; }
        public int? event_type_id { get; set; }
        public DateTime? event_date { get; set; }
        public int? structure_id { get; set; }
        public int? application_id { get; set; }
    }
}