
namespace Domain.Entities;

public class FeedbackFiles
{
     public int id { get; set; }
     public int? feedback_id { get; set; }
     public int? file_id { get; set; }
     public DateTime? created_at { get; set; }
     public DateTime? updated_at { get; set; }
     public int? created_by { get; set; }
     public int? updated_by { get; set; }
}