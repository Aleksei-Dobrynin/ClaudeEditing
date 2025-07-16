namespace Domain.Entities
{
    public class FileDownloadLog : BaseLogDomain
    {
        public int id { get; set; }
        public int user_id { get; set; }
        public string? username { get; set; }
        public int file_id { get; set; }
        public string? file_name { get; set; }
        public DateTime? download_time { get; set; }
    }
}
