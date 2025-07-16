using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.IntegrationTests.Helpers;
using Xunit;
using Xunit.Abstractions;

namespace WebApi.IntegrationTests.E2E
{
    /// <summary>
    /// E2E тест для проверки полного цикла обработки заявки:
    /// - Регистрация заявки
    /// - Назначение исполнителя
    /// - Обработка исполнителем
    /// - Технический совет
    /// - Выдача документов
    /// - Финансовое закрытие
    /// </summary>
    [Collection("Database collection")]
    public class ApplicationProcessingE2ETest : BaseE2ETest
    {
        private readonly ApiClient _apiClient;
        private readonly ITestOutputHelper _output;

        // Тестовые данные
        private int _customerId;
        private int _serviceId;
        private int _districtId;
        private int _applicationId;
        private int _registerEmployeeId;
        private int _departmentStructureId;
        private int _processingEmployeeId;
        private int _techCouncilEmployeeId;
        private int _financeEmployeeId;
        private int _registrarPostId;
        private int _specialistPostId;
        private int _employeeInStructureId;
        private int _taskId;

        // Статусы из SeedData.sql
        private readonly int _statusReviewId = 1; // "Прием заявления"
        private readonly int _statusPreparationId = 11; // "Изучение материалов и подготовка"
        private readonly int _statusTechCouncilId = 19; // "Отправить на техсовет"
        private readonly int _statusDocumentReadyId = 6; // "Пакет документов готов к выдаче"
        private readonly int _statusDocumentIssuedId = 4; // "Пакет документов выдан заявителю"
        private readonly int _statusDoneId = 2; // "Реализован"

        public ApplicationProcessingE2ETest(ITestOutputHelper output)
            : base()
        {
            _output = output;
            _apiClient = new ApiClient(_client);
        }

        protected override async Task SeedTestDataAsync()
        {
            _output.WriteLine("Подготовка тестовых данных");

            try
            {
                // 1. Базовые справочники из SeedData.sql
                _serviceId = 1; // Первая услуга из сида
                _districtId = 1; // Первомайский район

                // 2. Создание заказчика
                _customerId = _testDataHelper.CreateCustomer("12345678901", "Тестовый заказчик", false);

                // 3. Создание структуры организации для обработки заявок
                _departmentStructureId = _testDataHelper.CreateStructure("Тестовый отдел");

                // 4. Создание должностей из структуры проекта
                _registrarPostId = await GetPostIdByCode("registrar");
                if (_registrarPostId == 0)
                {
                    _registrarPostId = await CreateStructurePost("Регистратор", "registrar");
                }

                _specialistPostId = await GetPostIdByCode("employee");
                if (_specialistPostId == 0)
                {
                    _specialistPostId = await CreateStructurePost("Специалист", "employee");
                }

                // 5. Создание сотрудников для разных этапов обработки
                _registerEmployeeId = _testDataHelper.CreateEmployee("Регистратор", "Заявок", "Тестович");
                _processingEmployeeId = _testDataHelper.CreateEmployee("Обработчик", "Заявок", "Тестович");
                _techCouncilEmployeeId = _testDataHelper.CreateEmployee("Член", "Техсовета", "Тестович");
                _financeEmployeeId = _testDataHelper.CreateEmployee("Финансист", "Платежей", "Тестович");

                // 6. Привязка сотрудников к структуре
                var registerEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_registerEmployeeId, _departmentStructureId, _registrarPostId);
                _employeeInStructureId = _testDataHelper.AssignEmployeeToStructure(_processingEmployeeId, _departmentStructureId, _specialistPostId);
                var techCouncilEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_techCouncilEmployeeId, _departmentStructureId, _specialistPostId);
                var financeEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_financeEmployeeId, _departmentStructureId, _specialistPostId);
            }
            catch (Exception ex)
            {
                _output.WriteLine($"Ошибка в методе SeedTestData: {ex.Message}");
                _output.WriteLine($"StackTrace: {ex.StackTrace}");
                throw;
            }
        }

        [Fact]
        public async Task CompleteApplicationProcessing_FromRegistrationToCompletion_Success()
        {

            await InitializeTestAsync();
            // Шаг 1: Регистрация новой заявки
            _output.WriteLine("Шаг 1: Регистрация новой заявки");

            var archObjectId = _testDataHelper.CreateArchObject(
                "Тестовый объект",
                "г. Бишкек, ул. Примерная, д. 123",
                _districtId
            );

            //var createApplicationRequest = new CreateApplicationRequest
            //{
            //    registration_date = DateTime.Now,
            //    ServiceId = _serviceId,
            //    CustomerId = _customerId,
            //    work_description = "Тестовое описание работ для полного цикла",
            //    ArchObjectId = archObjectId,
            //    Comment = "Тестовая заявка для полного цикла обработки"
            //};

            var application = await _apiClient.CreateApplication(_customerId, _serviceId, archObjectId, "Тестовое описание работ для полного цикла", "Тестовая заявка для полного цикла обработки");
            Assert.NotNull(application);
            _applicationId = application.Id;

            _output.WriteLine($"Создана новая заявка с ID: {_applicationId}");

            // Проверка статуса заявки (должен быть "Прием заявления")
            var newApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusReviewId, newApplication.status_id);

            // Шаг 2: Назначение исполнителя и начало обработки
            _output.WriteLine("Шаг 2: Назначение исполнителя и начало обработки");

            // Создание задачи для заявки
            _taskId = _testDataHelper.CreateApplicationTask(_applicationId, "Основная задача по заявке", 1, _departmentStructureId);

            // Назначение исполнителя для задачи
            var assigneeId = _testDataHelper.AssignTaskToEmployee(_taskId, _employeeInStructureId);

            // Изменение статуса заявки на "Изучение материалов и подготовка"
            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusPreparationId, _registerEmployeeId);

            var inProgressApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusPreparationId, inProgressApplication.status_id);

            _output.WriteLine($"Заявка назначена исполнителю и переведена в статус 'Изучение материалов и подготовка'");

            // Добавление файла документа к заявке
            var docContent = _testDataHelper.CreatePdfDocument("Тестовый документ для обработки");
            var uploadedFile = await _apiClient.UploadDocument(_applicationId, 1, await CreateServiceDoc(),docContent, "test_processing_document.pdf");
            Assert.NotNull(uploadedFile);

            // Шаг 3: Отправка на технический совет
            _output.WriteLine("Шаг 3: Отправка на технический совет");

            // Изменение статуса заявки на "Отправить на техсовет"
            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusTechCouncilId, _processingEmployeeId);

            var techCouncilApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusTechCouncilId, techCouncilApplication.status_id);

            _output.WriteLine($"Заявка отправлена на технический совет");

            // Шаг 4: Принятие решения техническим советом
            _output.WriteLine("Шаг 4: Принятие решения техническим советом");

            // Создание технического решения (убедимся, что оно существует или создадим)
            var techDecisionId = await GetTechDecisionIdByCode("approve") ??
                await CreateTechDecision("Утверждено техсоветом", "approve");

            // Обновление заявки с техническим решением
            await UpdateApplicationWithTechDecision(_applicationId, techDecisionId);

            // Изменение статуса заявки на "Пакет документов готов к выдаче"
            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusDocumentReadyId, _techCouncilEmployeeId);

            var approvedApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDocumentReadyId, approvedApplication.status_id);

            _output.WriteLine($"Технический совет согласовал заявку, документы готовы к выдаче");

            // Шаг 5: Выдача документов
            _output.WriteLine("Шаг 5: Выдача документов заявителю");

            // Генерация выходного документа
            var documentId = await CreateOutputDocument(_applicationId, "Итоговый документ");
            Assert.NotEqual(0, documentId);

            // Изменение статуса заявки на "Документы выданы"
            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusDocumentIssuedId, _techCouncilEmployeeId);

            var issuedApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDocumentIssuedId, issuedApplication.status_id);

            _output.WriteLine($"Документы выданы заявителю");

            // Шаг 6: Финансовое закрытие
            _output.WriteLine("Шаг 6: Финансовое закрытие заявки");

            // Создание калькуляции
            var paymentId = _testDataHelper.CreatePayment(
                _applicationId,
                1000.00m,
                "Оплата услуг",
                _departmentStructureId
            );
            Assert.NotEqual(0, paymentId);

            // Обновление заявки - установка даты завершения
            await SetApplicationDoneDate(_applicationId);

            // Изменение статуса на "Реализован"
            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusDoneId, _financeEmployeeId);

            var completedApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDoneId, completedApplication.status_id);

            _output.WriteLine($"Заявка успешно закрыта");

            // Финальная проверка
            _output.WriteLine("Шаг 7: Проверка итогового состояния заявки");

            var finalApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDoneId, finalApplication.status_id);
            Assert.Equal(_serviceId, finalApplication.service_id);
            
            // Проверка, что у заявки есть выходные документы
            // var applicationDocuments = await _apiClient.GetApplicationDocuments(_applicationId);
            // Assert.NotEmpty(applicationDocuments);

            _output.WriteLine("Тест успешно завершен");
        }

        #region Вспомогательные методы

        private async Task<int> GetPostIdByCode(string code)
        {
            try
            {
                int result = DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM structure_post 
                    WHERE code = @code
                    LIMIT 1",
                    new Dictionary<string, object> { ["@code"] = code });

                _output.WriteLine($"Найдена должность с кодом '{code}': ID = {result}");
                return result;
            }
            catch (Exception ex)
            {
                _output.WriteLine($"Ошибка при поиске должности с кодом '{code}': {ex.Message}");
                return 0;
            }
        }

        private async Task<int> CreateStructurePost(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO structure_post (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<int?> GetTechDecisionIdByCode(string code)
        {
            try
            {
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM tech_decision 
                    WHERE code = @code
                    LIMIT 1",
                    new Dictionary<string, object> { ["@code"] = code });
            }
            catch
            {
                return null;
            }
        }

        private async Task<int> CreateTechDecision(string name, string code)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO tech_decision (name, code, created_at, updated_at) 
                VALUES (@name, @code, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@code"] = code,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task UpdateApplicationWithTechDecision(int applicationId, int techDecisionId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application 
                SET tech_decision_id = @techDecisionId, tech_decision_date = @date, updated_at = @updated_at 
                WHERE id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@techDecisionId"] = techDecisionId,
                    ["@date"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<int> CreateOutputDocument(int applicationId, string documentName)
        {
            var fileId = _testDataHelper.CreateFile(documentName, $"/files/test/{Guid.NewGuid()}.pdf");

            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO uploaded_application_document (file_id, application_document_id, name, created_at, updated_at, is_outcome) 
                VALUES (@fileId, @applicationId, @name, @created_at, @updated_at, true) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@fileId"] = fileId,
                    ["@applicationId"] = applicationId,
                    ["@name"] = documentName,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task SetApplicationDoneDate(int applicationId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application 
                SET done_date = @date, updated_at = @updated_at 
                WHERE id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@date"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }
        
        private async Task<int> CreateServiceDoc()
        {
            int serviceId = CreateService("Test Service", 10);
            int documentTypeId = CreateApplicationDocumentType("Test Type");
            int applicationDocumentId = CreateApplicationDocument("Test Document", documentTypeId);
            int serviceDocumentId = CreateServiceDocument(serviceId, applicationDocumentId);

            return serviceDocumentId;
        }
        
        private int CreateService(string name, int dayCount)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service (name, day_count, is_active, created_at, updated_at)
                VALUES (@name, @day_count, @is_active, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@day_count"] = dayCount,
                    ["@is_active"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }
        
        private int CreateApplicationDocumentType(string name)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_document_type (name, created_at, updated_at)
                VALUES (@name, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private int CreateApplicationDocument(string name, int documentTypeId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_document (name, document_type_id, created_at, updated_at)
                VALUES (@name, @document_type_id, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@document_type_id"] = documentTypeId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }
        
        private int CreateServiceDocument(int serviceId, int applicationDocumentId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO service_document (service_id, application_document_id, is_required, created_at, updated_at)
                VALUES (@service_id, @application_document_id, @is_required, @created_at, @updated_at)
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@service_id"] = serviceId,
                    ["@application_document_id"] = applicationDocumentId,
                    ["@is_required"] = true,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }
        
        #endregion
    }
}