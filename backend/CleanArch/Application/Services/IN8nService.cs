using Domain.Entities;

namespace Application.Services
{
    public interface IN8nService
    {
        Task<bool> NotifyNewApplication(int applicationId, string? email);
        Task<List<ValidationResult>> ValidateWorkflow(int applicationId, string validationUrl);
        Task<bool> ExecuteWorkflow(int applicationId, string workflowUrl);
        Task<bool> RegisterInFinBook(Domain.Entities.Application application, bool ready);
        Task<bool> RegisterInFinBookMBank(Domain.Entities.Application application, string payment_identifier = "", decimal sum = 0);
        Task<bool> NotifyNewDocumentUpload(int applicationId);
        Task UserSendPassword(string email, string pass);
        Task<N8nValidationResult> CheckApplicationBeforeRegisteringN8N(int applicationId);
        Task UserSendNewPassword(string email, string pass);
    }
}