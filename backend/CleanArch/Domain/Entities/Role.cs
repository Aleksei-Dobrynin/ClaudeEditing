namespace Domain.Entities
{
    public class Role : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
    }
}
