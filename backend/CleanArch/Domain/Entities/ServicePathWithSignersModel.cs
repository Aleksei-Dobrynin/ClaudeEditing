namespace Infrastructure.Data.Models
{
    /// <summary>
    /// Модель для возврата услуги с полной иерархией: путь → шаги → документы → подписанты
    /// </summary>
    public class ServiceWithPathAndSignersModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; }
        
        /// <summary>
        /// Активный путь услуги (service_path)
        /// </summary>
        public ServicePathWithStepsModel service_path { get; set; }
    }
    
    public class ServicePathWithStepsModel
    {
        public int id { get; set; }
        public int service_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool is_default { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        
        /// <summary>
        /// Список шагов пути
        /// </summary>
        public List<PathStepWithDocumentsModel> steps { get; set; }
    }
    
    public class PathStepWithDocumentsModel
    {
        public int id { get; set; }
        public int path_id { get; set; }
        public int order_number { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string step_type { get; set; }
        public int estimated_days { get; set; }
        public bool is_required { get; set; }
        public bool wait_for_previous_steps { get; set; }
        public int responsible_org_id { get; set; }
        public string responsible_org_name { get; set; }
        
        /// <summary>
        /// Список обязательных документов для этого шага
        /// </summary>
        public List<RequiredDocumentWithApproversModel> required_documents { get; set; }
    }
    
    public class RequiredDocumentWithApproversModel
    {
        public int id { get; set; }
        public int step_id { get; set; }
        public int document_type_id { get; set; }
        public string document_type_name { get; set; }
        public bool is_required { get; set; }
        
        /// <summary>
        /// Список подписантов для этого документа
        /// </summary>
        public List<DocumentApproverDetailModel> approvers { get; set; }
    }
    
    public class DocumentApproverDetailModel
    {
        public int id { get; set; }
        public int step_doc_id { get; set; }
        public int approval_order { get; set; }
        public int position_id { get; set; }
        public string position_name { get; set; }
        public int department_id { get; set; }
        public string department_name { get; set; }
        public bool is_required { get; set; }
    }
}