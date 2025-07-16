namespace WebApi.Dtos
{
    public class UploadedApplicationDocument
    {
        public class CreatedUploadedApplicationDocumentRequest
        {
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? created_by { get; set; }
            public DateTime? updated_by { get; set; }
            public int application_document { get; set; }
            public string? name { get; set; }
           
            public int service_document_id { get; set; }
            public int file_id { get; set; }
        }

        public class UpdatUploadedApplicationDocumentRequest
        {
            public int id { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? created_by { get; set; }
            public DateTime? updated_by { get; set; }
            public int application_document { get; set; }
            public string? name { get; set; }

            public int service_document_id { get; set; }
            public int file_id { get; set; }
        }
    }
}
