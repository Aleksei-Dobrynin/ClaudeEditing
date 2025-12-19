using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    // ============================================
    // REQUEST & RESPONSE MODELS
    // ============================================

    /// <summary>
    /// Модель для массового сохранения service_path со всеми дочерними данными
    /// </summary>
    public class BulkSaveServicePathRequest
    {
        // Основная сущность service_path
        public ServicePathModel ServicePath { get; set; }

        // Дочерние сущности
        public List<PathStepModel> PathSteps { get; set; }
        public List<StepRequiredDocumentModel> StepRequiredDocuments { get; set; }
        public List<StepPartnerModel> StepPartners { get; set; }
        public List<StepDependencyModel> StepDependencies { get; set; }
        public List<DocumentApproverModel> DocumentApprovers { get; set; }

        // Списки ID для удаления
        public List<int> PathStepsToDelete { get; set; }
        public List<int> StepRequiredDocumentsToDelete { get; set; }
        public List<int> StepPartnersToDelete { get; set; }
        public List<int> StepDependenciesToDelete { get; set; }
        public List<int> DocumentApproversToDelete { get; set; }
    }

    /// <summary>
    /// Ответ на запрос массового сохранения
    /// </summary>
    public class BulkSaveResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        // Сохраненная основная сущность
        public ServicePathModel ServicePath { get; set; }

        // Маппинг временных ID на реальные
        public Dictionary<int, int> PathStepIdMap { get; set; }
        public Dictionary<int, int> StepRequiredDocumentIdMap { get; set; }

        public BulkSaveResponse()
        {
            PathStepIdMap = new Dictionary<int, int>();
            StepRequiredDocumentIdMap = new Dictionary<int, int>();
        }
    }

    /// <summary>
    /// Ответ на запрос загрузки со всеми дочерними
    /// </summary>
    public class LoadServicePathWithChildrenResponse
    {
        public ServicePathModel ServicePath { get; set; }
        public List<PathStepModel> PathSteps { get; set; }
        public List<StepRequiredDocumentModel> StepRequiredDocuments { get; set; }
        public List<StepPartnerModel> StepPartners { get; set; }
        public List<StepDependencyModel> StepDependencies { get; set; }
        public List<DocumentApproverModel> DocumentApprovers { get; set; }

        public LoadServicePathWithChildrenResponse()
        {
            PathSteps = new List<PathStepModel>();
            StepRequiredDocuments = new List<StepRequiredDocumentModel>();
            StepPartners = new List<StepPartnerModel>();
            StepDependencies = new List<StepDependencyModel>();
            DocumentApprovers = new List<DocumentApproverModel>();
        }
    }

    // ============================================
    // ENTITY MODELS
    // ============================================

    /// <summary>
    /// Модель для service_path
    /// </summary>
    public class ServicePathModel
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
    }

    /// <summary>
    /// Модель для path_step с флагами состояния
    /// </summary>
    public class PathStepModel
    {
        public int Id { get; set; }
        public string StepType { get; set; }
        public int PathId { get; set; }
        public int ResponsibleOrgId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int OrderNumber { get; set; }
        public bool IsRequired { get; set; }
        public int EstimatedDays { get; set; }
        public bool WaitForPreviousSteps { get; set; }

        // Флаги для отслеживания изменений
        public bool IsNew { get; set; }
        public bool IsModified { get; set; }

        // Временный ID (отрицательный для новых записей)
        public int? TempId { get; set; }
    }

    /// <summary>
    /// Модель для step_required_document
    /// </summary>
    public class StepRequiredDocumentModel
    {
        public int Id { get; set; }
        public int StepId { get; set; }
        public int DocumentTypeId { get; set; }
        public bool IsRequired { get; set; }

        public bool IsNew { get; set; }
        public bool IsModified { get; set; }
        public int? TempId { get; set; }
    }

    /// <summary>
    /// Модель для step_partner
    /// </summary>
    public class StepPartnerModel
    {
        public int Id { get; set; }
        public bool IsRequired { get; set; }
        public int PartnerId { get; set; }      // ✅ ИСПРАВЛЕНО: было ConfigurationId
        public string Role { get; set; }        // ✅ ДОБАВЛЕНО: новое поле
        public int StepId { get; set; }

        public bool IsNew { get; set; }
        public bool IsModified { get; set; }
    }

    /// <summary>
    /// Модель для step_dependency
    /// </summary>
    public class StepDependencyModel
    {
        public int Id { get; set; }
        public int ServicePathId { get; set; }
        public int DependentStepId { get; set; }
        public int PrerequisiteStepId { get; set; }
        public bool IsStrict { get; set; }

        public bool IsNew { get; set; }
        public bool IsModified { get; set; }
    }

    /// <summary>
    /// Модель для document_approver
    /// </summary>
    public class DocumentApproverModel
    {
        public int Id { get; set; }
        public int StepDocId { get; set; }
        public int DepartmentId { get; set; }
        public int PositionId { get; set; }
        public bool IsRequired { get; set; }
        public int ApprovalOrder { get; set; }

        public bool IsNew { get; set; }
        public bool IsModified { get; set; }
        public int? TempId { get; set; }
    }
}