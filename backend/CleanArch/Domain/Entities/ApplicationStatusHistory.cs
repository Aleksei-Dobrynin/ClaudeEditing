namespace Domain.Entities
{
    public class ApplicationStatusHistory : BaseLogDomain
    {
        public int id { get; set; }
        public int application_id { get; set; }
        public int status_id { get; set; }
        public string? status_navName { get; set; }
        public int old_status_id { get; set; }
        public string? old_status_navName { get; set; }
        public int user_id { get; set; }
        public DateTime date_change { get; set; }
        public string full_name { get; set; }   
    }
}
