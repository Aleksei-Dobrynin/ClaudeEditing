namespace Domain.Entities
{
    public class SmejPortalApprovalRequest
    {
        public int id { get; set; }
        public string bga_application_number { get; set; }
        public int? organization_id { get; set; }
        public string applicant_name { get; set; }
        public string approval_type { get; set; }
        public string current_status { get; set; }
        public string priority { get; set; }
        public int? operator_id { get; set; }
        public DateTime? received_date { get; set; }
        public DateTime? deadline_date { get; set; }
        public DateTime? completed_date { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }
}