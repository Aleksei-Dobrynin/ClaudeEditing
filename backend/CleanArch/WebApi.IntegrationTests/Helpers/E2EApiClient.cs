using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Domain.Entities;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Array = Mysqlx.Datatypes.Array;

namespace WebApi.IntegrationTests.E2E
{
    public class ApiClient
    {
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _serializerOptions;

        public ApiClient(HttpClient client)
        {
            _client = client;
            _serializerOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        #region Application Management

        /// <summary>
        /// Создает новую заявку
        /// </summary>
        public async Task<ApplicationResponse> CreateApplication(int customerId, int serviceId, int archObjectId, string workDescription, string comment = null)
        {
            // Сначала получим данные о клиенте и объекте
            var customer = await GetCustomerById(customerId);

            // Создаем правильную структуру запроса
            var request = new CreateApplicationRequest
            {
                registration_date = DateTime.Now,
                customer_id = customerId,
                service_id = serviceId,
                arch_object_id = archObjectId,
                work_description = workDescription,

                // Заполняем обязательные поля для API
                //status_id = 1, // "Прием заявления" статус по умолчанию
                //workflow_id = 1, // Основной процесс по умолчанию

                // Добавляем объект Customer
                customer = new CreateCustomerRequest
                {
                    id = customer.Id,
                    pin = customer.Pin,
                    customerRepresentatives = new List<CustomerRepresentative>()
                    // Добавьте другие необходимые свойства
                    // Можно получить их из response метода GetCustomerById
                },

                // Добавляем список ArchObject
                archObjects = new List<UpdateArchObjectRequest>
                {
                    new UpdateArchObjectRequest
                    {
                        id = archObjectId,
                        name = "test",
                        address = "address test",
                        district_id = 1,
                        tags = System.Array.Empty<int>(),
                    }
                }
            };

            return await PostAsync<ApplicationResponse>("/Application/create", request);
        }

        /// <summary>
        /// Получает заявку по идентификатору
        /// </summary>
        public async Task<ApplicationResponse> GetApplicationById(int id)
        {
            return await GetAsync<ApplicationResponse>($"/application/getonebyid?id={id}");
        }

        /// <summary>
        /// Обновляет статус заявки
        /// </summary>
        public async Task<bool> UpdateApplicationStatus(int applicationId, int statusId)
        {
            var request = new
            {
                applicationId,
                statusId
            };

            var response = await PostAsync<JObject>("/api/application/changestatus", request);
            return response != null;
        }

        /// <summary>
        /// Назначает исполнителя для заявки
        /// </summary>
        public async Task<bool> AssignExecutor(int applicationId, int employeeId)
        {
            var request = new
            {
                applicationId,
                employeeId
            };

            var response = await PostAsync<JObject>("/api/application/assignexecutor", request);
            return response != null;
        }

        #endregion

        #region Customer Management

        /// <summary>
        /// Создает нового заказчика
        /// </summary>
        public async Task<CustomerResponse> CreateCustomer(CreateCustomerRequest request)
        {
            return await PostAsync<CustomerResponse>("/api/customer/create", request);
        }

        /// <summary>
        /// Получает заказчика по идентификатору
        /// </summary>
        public async Task<CustomerResponse> GetCustomerById(int id)
        {
            return await GetAsync<CustomerResponse>($"/customer/getonebyid?id={id}");
        }

        /// <summary>
        /// Поиск заказчика по ПИН
        /// </summary>
        public async Task<List<CustomerResponse>> SearchCustomerByPin(string pin)
        {
            return await GetAsync<List<CustomerResponse>>($"/api/customer/searchbypin?pin={pin}");
        }

        #endregion

        #region Document Management

        /// <summary>
        /// Загружает документ
        /// </summary>
        public async Task<FileResponse> UploadDocument(int applicationId, int documentTypeId, int serviceDocumentId, byte[] fileContent, string fileName)
        {
            var form = new MultipartFormDataContent();
            form.Add(new StringContent(applicationId.ToString()), "application_document_id");
            form.Add(new StringContent(serviceDocumentId.ToString()), "service_document_id");
            form.Add(new StringContent("Test Uploaded Document"), "name");

            // Add a document file simulation
            var documentContent = new ByteArrayContent(System.Text.Encoding.UTF8.GetBytes("This is a test document"));
            documentContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            
            form.Add(documentContent, "document.file", "test_document.txt");
            form.Add(new StringContent("Test Document"), "document.name");
            

            var response = await _client.PostAsync("/uploaded_application_document", form);
            // response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<FileResponse>(jsonString);
        }

        /// <summary>
        /// Получает список документов для заявки
        /// </summary>
        public async Task<List<DocumentResponse>> GetApplicationDocuments(int applicationId)
        {
            return await GetAsync<List<DocumentResponse>>($"/document/getbyapplication?applicationId={applicationId}");
        }

        #endregion

        #region Technical Council

        /// <summary>
        /// Отправляет заявку на технический совет
        /// </summary>
        public async Task<bool> SendToTechnicalCouncil(int applicationId, List<int> departmentIds)
        {
            var request = new
            {
                ApplicationId = applicationId,
                DepartmentIds = departmentIds
            };

            var response = await PostAsync<JObject>("/api/techcouncil/send", request);
            return response != null;
        }

        /// <summary>
        /// Регистрирует решение технического совета
        /// </summary>
        public async Task<bool> RegisterTechnicalCouncilDecision(int applicationId, int decisionTypeId, string comment)
        {
            var request = new
            {
                ApplicationId = applicationId,
                DecisionTypeId = decisionTypeId,
                Comment = comment
            };

            var response = await PostAsync<JObject>("/api/techcouncil/registerdecision", request);
            return response != null;
        }

        #endregion

        #region Payment Operations

        /// <summary>
        /// Создает калькуляцию для заявки
        /// </summary>
        public async Task<PaymentResponse> CreatePaymentCalculation(CreatePaymentRequest request)
        {
            return await PostAsync<PaymentResponse>("/api/payment/create", request);
        }

        /// <summary>
        /// Регистрирует оплату
        /// </summary>
        public async Task<bool> RegisterPayment(int applicationId, decimal amount, string paymentIdentifier)
        {
            var request = new
            {
                ApplicationId = applicationId,
                Amount = amount,
                PaymentIdentifier = paymentIdentifier,
                PaymentDate = DateTime.Now
            };

            var response = await PostAsync<JObject>("/api/payment/register", request);
            return response != null;
        }

        #endregion

        #region Helper Methods

        private async Task<T> GetAsync<T>(string endpoint)
        {
            var response = await _client.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(content);
        }

        private async Task<T> PostAsync<T>(string endpoint, object data)
        {
            var json = JsonConvert.SerializeObject(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync(endpoint, content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(responseContent);
        }

        #endregion
    }

    #region DTO Classes

    public class CreateApplicationRequest
    {
        public DateTime? registration_date { get; set; }
        public int customer_id { get; set; }
        public int status_id { get; set; }
        public int workflow_id { get; set; }
        public int service_id { get; set; }
        public int? workflow_task_structure_id { get; set; }
        public DateTime? deadline { get; set; }
        public int? arch_object_id { get; set; }
        public DateTime? updated_at { get; set; }
        public string? work_description { get; set; }
        public int? object_tag_id { get; set; }
        public CreateCustomerRequest customer { get; set; }
        public List<UpdateArchObjectRequest> archObjects { get; set; }
        public string? incoming_numbers { get; set; }
        public string? outgoing_numbers { get; set; }
    }

    public class UpdateArchObjectRequest
    {
        public int id { get; set; }
        public string? address { get; set; }
        public string? name { get; set; }
        public string? identifier { get; set; }
        public int? district_id { get; set; }
        public string? description { get; set; }
        public int[] tags { get; set; }
        public double? xcoordinate { get; set; }
        public double? ycoordinate { get; set; }
    }

    public class ApplicationResponse
    {
        public int Id { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int StatusId { get; set; }
        public int status_id { get; set; }
        public string StatusName { get; set; }
        public int ServiceId { get; set; }
        public int service_id { get; set; }
        public string ServiceName { get; set; }
        public int CustomerId { get; set; }
        public int customer_id { get; set; }
        public string CustomerFullName { get; set; }
        public DateTime? Deadline { get; set; }
        public string Number { get; set; }
        public bool IsPaid { get; set; }
    }

    public class CreateCustomerRequest
    {
        public int id { get; set; }
        public string? pin { get; set; }
        public bool? is_organization { get; set; }
        public string? full_name { get; set; }
        public string? address { get; set; }
        public string? director { get; set; }
        public string? okpo { get; set; }
        public int? organization_type_id { get; set; }
        public string? payment_account { get; set; }
        public string? postal_code { get; set; }
        public string? ugns { get; set; }
        public string? bank { get; set; }
        public string? bik { get; set; }
        public string? registration_number { get; set; }
        public string? individual_name { get; set; }
        public string? individual_secondname { get; set; }
        public string? individual_surname { get; set; }
        public int? identity_document_type_id { get; set; }
        public string? document_serie { get; set; }
        public DateTime? document_date_issue { get; set; }
        public string? document_whom_issued { get; set; }
        public string? sms_1 { get; set; }
        public string? sms_2 { get; set; }
        public string? email_1 { get; set; }
        public string? email_2 { get; set; }
        public string? telegram_1 { get; set; }
        public string? telegram_2 { get; set; }
        public List<Domain.Entities.CustomerRepresentative> customerRepresentatives { get; set; }
        public bool? is_foreign { get; set; }
        public int? foreign_country { get; set; }
    }

    public class CustomerContactRequest
    {
        public string Value { get; set; }
        public int TypeId { get; set; }
        public bool AllowNotification { get; set; }
    }

    public class CustomerResponse
    {
        public int Id { get; set; }
        public string Pin { get; set; }
        public bool IsOrganization { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
    }

    public class FileResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
    }

    public class DocumentResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int FileId { get; set; }
        public int DocumentTypeId { get; set; }
        public string DocumentTypeName { get; set; }
    }

    public class CreatePaymentRequest
    {
        public int ApplicationId { get; set; }
        public decimal Sum { get; set; }
        public string Description { get; set; }
        public int StructureId { get; set; }
    }

    public class PaymentResponse
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public decimal Sum { get; set; }
        public string Description { get; set; }
    }

    #endregion
}