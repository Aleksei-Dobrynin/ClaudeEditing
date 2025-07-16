using Application.Services;
using Domain.Entities;
using System;

namespace Application.Tests.Mocks
{
    public class MockN8nService : IN8nService
    {
        private readonly bool _alwaysSucceed;
        private readonly List<string> _calls = new List<string>();

        public MockN8nService(bool alwaysSucceed = true)
        {
            _alwaysSucceed = alwaysSucceed;
        }

        public List<string> GetCalls() => _calls;

        public Task<bool> NotifyNewApplication(int applicationId, string? email)
        {
            _calls.Add($"NotifyNewApplication:{applicationId}:{email}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task<bool> RegisterInFinBookMBank(Domain.Entities.Application application, string payment_identifier = "", decimal sum = 0)
        {
            _calls.Add($"RegisterInFinBookMBank:{application.id}:{application.number}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task<bool> NotifyNewDocumentUpload(int applicationId)
        {
            _calls.Add($"NotifyNewDocumentUpload:{applicationId}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task UserSendPassword(string email, string pass)
        {
            _calls.Add($"UserSendPassword:{email}:{pass}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task<bool> RegisterInFinBook(Domain.Entities.Application application)
        {
            _calls.Add($"RegisterInFinBook:{application.id}:{application.number}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task<bool> ExecuteWorkflow(int applicationId, string workflowUrl)
        {
            _calls.Add($"ExecuteWorkflow:{applicationId}:{workflowUrl}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task<List<ValidationResult>> ValidateWorkflow(int applicationId, string validationUrl)
        {
            _calls.Add($"ValidateWorkflow:{applicationId}:{validationUrl}");
            return Task.FromResult(new List<ValidationResult>
            {
                new ValidationResult { valid = true, error = null }
            });
        }

        public Task<bool> RegisterInFinBook(Domain.Entities.Application application, bool ready)
        {
            _calls.Add($"RegisterInFinBook:{application.id}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task UserSendNewPassword(string email, string pass)
        {
            throw new NotImplementedException();
        }

        public Task<N8nValidationResult> CheckApplicationBeforeRegisteringN8N(int applicationId)
        {
            throw new NotImplementedException();
        }
    }
}