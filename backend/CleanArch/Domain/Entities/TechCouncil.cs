namespace Domain.Entities
{
    public class TechCouncil : BaseLogDomain
    {
       public int id { get; set; }
       public int structure_id { get; set; }
       public string structure_name { get; set; }
       public int application_id { get; set; }
       public string? decision { get; set; }
       public int? decision_type_id { get; set; }
       public DateTime? date_decision { get; set; }
       public int? employee_id { get; set; }
       public string employee_name { get; set; }
       public int? tech_council_session_id { get; set; }
       public string created_by_name { get; set; }
       public List<TechCouncilFiles>? files { get; set; }
       public List<LegalRecordInCouncil>? legal_records { get; set; }
    }
    
    public class TechCouncilTable
    {
        public int id { get; set; }
        public int application_id { get; set; }
        public string application_number { get; set; }
        public DateTime? tech_decision_date { get; set; }
        public string full_name { get; set; }
        public string address { get; set; }
        public string tech_decision_name { get; set; }
        public List<TechCouncilTableDetail> details { get; set; }
    }
    
    public class TechCouncilTableDetail
    {
        public int structure_id { get; set; }
        public string decision_type_name { get; set; }
        public string structure_name { get; set; }
        public string employee_name { get; set; }
    }
    
    public class FileTechCouncilRequest
    {
        public int id { get; set; }
        public int structure_id { get; set; }
        public int application_id { get; set; }
        public File document { get; set; }
    }
    
    public class UpdateLegalRecordsRequest
    {
        public int id { get; set; }
        public int structure_id { get; set; }
        public int application_id { get; set; }
        public List<int> legal_records { get; set; }
    }
}