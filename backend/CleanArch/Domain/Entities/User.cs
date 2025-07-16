namespace Domain.Entities
{
    public class User : BaseLogDomain
    {
        public int id { get; set; }
        public string? userId { get; set; }
        public string? type_system { get; set; }
        public string? password_hash { get; set; }
        public string? email { get; set; }
    }
}
