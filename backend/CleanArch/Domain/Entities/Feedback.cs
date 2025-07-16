using Microsoft.AspNetCore.Http;

namespace Domain.Entities;

public class Feedback
{
     public int id { get; set; }
     public DateTime record_date { get; set; }
     public int? employee_id { get; set; }
     public string description { get; set; }
     public DateTime? created_at { get; set; }
     public DateTime? updated_at { get; set; }
     public int? created_by { get; set; }
     public int? updated_by { get; set; }
}

public class FeedbackRequest
{
    public string? Description { get; set; }

    public List<IFormFile>? Files { get; set; }
}

public class FeedbackCreateRequest
{
    public string? Description { get; set; }

    public List<File>? Files { get; set; }
}