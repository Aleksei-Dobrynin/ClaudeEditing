namespace Domain.Entities
{
    public class FileForApplicationDocument : BaseLogDomain
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public string? file_name { get; set; }
        public int document_id { get; set; }
        public int type_id { get; set; }
        public string? type_name { get; set; }
        public string? name { get; set; }
        public File document { get; set; }
    }
}
