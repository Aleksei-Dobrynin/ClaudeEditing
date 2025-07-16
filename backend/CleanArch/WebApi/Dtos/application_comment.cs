namespace WebApi.Dtos
{
    public class Createapplication_commentRequest
    {
        public int id { get; set; }
        public int? application_id { get; set; }
        public string? comment { get; set; }

  
        public string? userEmail { get; set; }
    }

    public class UpdateApplication_commentRequest
    {
        public int id { get; set; }
        public int? application_id { get; set; }
        public string? comment { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }
}
