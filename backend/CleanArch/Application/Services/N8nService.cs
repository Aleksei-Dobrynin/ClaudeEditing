using System.Text;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Application.Services
{
    public class N8nService : IN8nService
    {
        private readonly ILogger<N8nService> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public N8nService(ILogger<N8nService> logger, IConfiguration configuration, HttpClient httpClient)
        {
            _logger = logger;
            _configuration = configuration;
            _httpClient = httpClient;
        }
        
        public async Task<bool> NotifyNewApplication(int applicationId, string? email)
        {
            try
            {
                string webhookUrl = _configuration["N8n:Webhooks:NewApplication"];
                
                var response = await _httpClient.GetAsync($"{webhookUrl}?id={applicationId}&email={email}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying N8n about new application {ApplicationId}", applicationId);
                return false;
            }
        }
        
        public async Task<List<ValidationResult>> ValidateWorkflow(int applicationId, string validationUrl)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{validationUrl}?application_id={applicationId}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var results = JsonConvert.DeserializeObject<List<ValidationResult>>(content);
                    return results ?? new List<ValidationResult>();
                }
                
                return new List<ValidationResult>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating workflow for application {ApplicationId}", applicationId);
                return new List<ValidationResult>();
            }
        }
        
        public async Task<bool> ExecuteWorkflow(int applicationId, string workflowUrl)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{workflowUrl}?application_id={applicationId}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing N8n workflow for application {ApplicationId}", applicationId);
                return false;
            }
        }
        
        public async Task<bool> RegisterInFinBook(Domain.Entities.Application application, bool ready)
        {
            return true ;
            try
            {
                string webhookUrl = _configuration["N8n:Webhooks:FinBook"];

                var nsp = decimal.Round((application.total_sum / 1.14m) * 0.02m, 2);
                var nds = decimal.Round((application.total_sum / 1.14m) * 0.12m, 2);
                
                if (!ready)
                {
                    nsp = 0;
                    nds = 0;
                    application.total_sum = 0;
                }

                var payload = new
                {
                    externalTxId = _configuration["N8n:prefix"] + application.number,
                    employees = new object[0],
                    requesterInn = application.customer_pin,
                    requesterName = application.customer_name,
                    serviceId = application.service_id,
                    serviceName = application.service_name,
                    sum = application.total_sum,
                    salesTax = nsp,
                    vat = nds,
                    legalType = application.customer_is_organization == true ? "ENTITY" : "INDIVIDUAL",
                    issuedDate = DateTime.UtcNow
                };

                var json = JsonConvert.SerializeObject(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync(webhookUrl, content);
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering application {ApplicationNumber} in FinBook", application.number);
                return false;
            }
        }
        
        public async Task<bool> RegisterInFinBookMBank(Domain.Entities.Application application, string payment_identifier, decimal sum)
        {
            return true;
            try
            {
                string webhookUrl = _configuration["N8n:Webhooks:FinBookMBank"];
                
                var payload = new
                {
                    personalId = _configuration["N8n:prefix"] + application.number,
                    externalTxId = payment_identifier,
                    sum = sum,
                    description = "",
                    createdDate = DateTime.UtcNow,
                };

                var json = JsonConvert.SerializeObject(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync(webhookUrl, content);
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering application {ApplicationNumber} in FinBook", application.number);
                return false;
            }
        }
        
        public async Task<bool> NotifyNewDocumentUpload(int applicationId)
        {
            try
            {
                string webhookUrl = _configuration["N8n:Webhooks:NewDocumentUpload"];
                
                var response = await _httpClient.GetAsync($"{webhookUrl}?name={applicationId}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying N8n about new document upload for application {ApplicationId}", applicationId);
                return false;
            }
        }
        
        public async Task UserSendPassword(string email, string pass)
        {
            try
            {
                using var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, _configuration["N8n:Webhooks:UserSendPassword"]);
                var json = $@"{{""email"": ""{email}"", ""password"": ""{pass}""}}";
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                request.Content = content;
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
            }catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying N8n about user password send");
            }
        }
        
        public async Task<N8nValidationResult> CheckApplicationBeforeRegisteringN8N(int applicationId)
        {
            try
            {
                string webhookUrl = _configuration["N8n:Webhooks:CheckApplicationBeforeRegistering"];

                if (webhookUrl == null) return new N8nValidationResult { Valid = true, Errors = new Dictionary<string, string> { } };
                
                var response = await _httpClient.GetAsync($"{webhookUrl}?application_id={applicationId}");
                var content = await response.Content.ReadAsStringAsync();
                
                var result = JsonConvert.DeserializeObject<N8nValidationResult>(content);

                return result ?? new N8nValidationResult
                {
                    Valid = false,
                    Errors = new Dictionary<string, string>
                    {
                        ["parse"] = "Ответ n8n не удалось разобрать"
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying N8n about new application {ApplicationId}", applicationId);
                return new N8nValidationResult
                {
                    Valid = false,
                    Errors = new Dictionary<string, string>
                    {
                        ["exception"] = ex.Message
                    }
                };
            }
        }
    

        public async Task UserSendNewPassword(string email, string pass)
        {
            try
            {
                using var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, _configuration["N8n:Webhooks:UserSendNewPassword"]);
                var json = $@"{{""email"": ""{email}"", ""password"": ""{pass}""}}";
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                request.Content = content;
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error notifying N8n about user password send");
            }
        }
    }
}