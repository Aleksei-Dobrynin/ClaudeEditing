namespace Domain.Entities
{
    public class UserRole : BaseLogDomain
    {
        public int id { get; set; }
        public int role_id { get; set; }
        public int structure_id { get; set; }
        public int user_id { get; set; }
    }
}
