namespace Domain.Entities
{
    public class File : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? path { get; set; }
        public byte[] body { get; set; }
    }
    
    public class FileHistoryLog : BaseLogDomain
    {
        public int id { get; set; }
        public string entity_name { get; set; }
        public int entity_id { get; set; }
        public string action { get; set; }
        public int file_id { get; set; }
    }

    public class FileSign
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public int? employee_id { get; set; }
        public string? employee_fullname { get; set; }
        public int? structure_employee_id { get; set; }
        public string? structure_fullname { get; set; }
        public int[] post_ids { get; set; }
        public int? user_id { get; set; }
        public string? user_full_name { get; set; }
        public string? pin_user { get; set; }
        public string? pin_organization { get; set; }
        public string? sign_hash { get; set; }
        public long? sign_timestamp { get; set; }
        public DateTime? timestamp { get; set; }
        public string? file_type_name { get; set; }
        public int? file_type_id { get; set; }
        public int? cabinet_file_id { get; set; }
        public string? file_name { get; set; }
        public string? application_number { get; set; }
        public string? file_type { get; set; }
    }
    
    public class FileSignInfo
    {
        public string? employee_fullname { get; set; }
        public string? structure_fullname { get; set; }
        public DateTime? timestamp { get; set; }
    }
    
    public class FilesSignInfo
    {
        public int service_document_id { get; set; }
        public int? file_id { get; set; }
        public int? employee_id { get; set; }
    }
}
