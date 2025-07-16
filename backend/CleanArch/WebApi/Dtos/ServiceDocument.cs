namespace WebApi.Dtos
{
    public class CreateServiceDocumentRequest
    {
        public int? service_id { get; set; }
        public int? application_document_id { get; set; }
        public bool? is_required { get; set; }
    }

    public class UpdateServiceDocumentRequest
    {
        public int id { get; set; }
        public int? service_id { get; set; }
        public int? application_document_id { get; set; }
        public bool? is_required { get; set; }
    }
}
