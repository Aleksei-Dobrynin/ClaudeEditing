namespace Domain.Entities
{
    public class UserLoginHistory : BaseLogDomain
    {
        public int id { get; set; }
        public string? user_id { get; set; }
        public string? ip_address { get; set; }
        public string? device { get; set; }
        public string? browser { get; set; }
        public string? os { get; set; }
        public DateTime? start_time { get; set; }
        public DateTime? end_time { get; set; }
        public bool success { get; set; }
    }
}
