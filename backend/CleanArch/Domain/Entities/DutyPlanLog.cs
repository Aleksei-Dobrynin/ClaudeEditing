namespace Domain.Entities
{
    public class DutyPlanLog : BaseLogDomain
    {
        public int id { get; set; }
        public int? application_id { get; set; }
        public int? application_number { get; set; }
        public string? doc_number { get; set; }
        public DateTime? date { get; set; }
        public int? from_employee_id { get; set; }
        public string? from_employee_name { get; set; }
        public int? archive_object_id { get; set; }
        public string? file_names { get; set; }
    }
}