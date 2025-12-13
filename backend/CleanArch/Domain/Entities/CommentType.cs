using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class CommentType : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? button_label { get; set; }
        public string? button_color { get; set; }
    }
}
