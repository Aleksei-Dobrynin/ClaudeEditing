using Domain;

namespace Infrastructure.Data.Models
{
    public class FileModel : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? path { get; set; }
    }
}
