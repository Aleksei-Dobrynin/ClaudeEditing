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
    /// E2E тест для проверки процесса формирования и проверки калькуляции по заявке:
    /// - Создание заявки
    /// - Формирование калькуляции основным отделом
    /// - Добавление дополнительного отдела
    /// - Формирование калькуляции дополнительным отделом
    /// - Объединение калькуляций
    /// - Проверка в плановом отделе
    /// </summary>
    [Collection("Database collection")]
    public class ApplicationCalculationE2ETest : BaseE2ETest
    {
        private readonly ApiClient _apiClient;
        private readonly ITestOutputHelper _output;

        // Тестовые данные
        private int _customerId;
        private int _serviceId;
        private int _districtId;
        private int _applicationId;
        private int _mainDepartmentId;
        private int _additionalDepartmentId;
        private int _financeDepartmentId;
        private int _mainEmployeeId;
        private int _additionalEmployeeId;
        private int _financeEmployeeId;
        private int _specialistPostId;
        private int _financePostId;

        // Статусы задач из SeedData.sql
        private readonly int _taskStatusAssignedId = 1; // "Назначено"
        private readonly int _taskStatusAtWorkId = 2; // "В работе"
        private readonly int _taskStatusDoneId = 3; // "Выполнен"

        public ApplicationCalculationE2ETest(ITestOutputHelper output)
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
                _customerId = _testDataHelper.CreateCustomer("12345678902", "Тестовый заказчик для калькуляции", false);

                // 3. Создание структуры организации
                _mainDepartmentId = _testDataHelper.CreateStructure("Основной отдел");
                _additionalDepartmentId = _testDataHelper.CreateStructure("Дополнительный отдел");
                _financeDepartmentId = _testDataHelper.CreateStructure("Плановый отдел");

                // 4. Создание должностей из структуры проекта
                // Проверяем существование должностей в базе
                _specialistPostId = await GetPostIdByCode("employee");
                if (_specialistPostId == 0)
                {
                    _specialistPostId = await CreateStructurePost("Специалист", "employee");
                }

                _financePostId = await GetPostIdByCode("accountant");
                if (_financePostId == 0)
                {
                    _financePostId = await CreateStructurePost("Бухгалтер", "accountant");
                }

                // 5. Создание сотрудников
                _mainEmployeeId = _testDataHelper.CreateEmployee("Сотрудник", "Основного", "Отдела");
                _additionalEmployeeId = _testDataHelper.CreateEmployee("Сотрудник", "Дополнительного", "Отдела");
                _financeEmployeeId = _testDataHelper.CreateEmployee("Сотрудник", "Финансового", "Отдела");

                // 6. Привязка сотрудников к структуре
                var mainEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_mainEmployeeId, _mainDepartmentId, _specialistPostId);
                var additionalEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_additionalEmployeeId, _additionalDepartmentId, _specialistPostId);
                var financeEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_financeEmployeeId, _financeDepartmentId, _financePostId);
            }
            catch (Exception ex)
            {
                _output.WriteLine($"Ошибка в методе SeedTestData: {ex.Message}");
                _output.WriteLine($"StackTrace: {ex.StackTrace}");
                throw;
            }
        }

        [Fact]
        public async Task CompleteCalculationProcess_WithMultipleDepartments_Success()
        {


            await InitializeTestAsync();
            // Шаг 1: Создание заявки
            _output.WriteLine("Шаг 1: Создание новой заявки");

            var archObjectId = _testDataHelper.CreateArchObject(
                "Тестовый объект для калькуляции",
                "г. Бишкек, ул. Расчетная, д. 456",
                _districtId
            );

            //var createApplicationRequest = new CreateApplicationRequest
            //{
            //    RegistrationDate = DateTime.Now,
            //    ServiceId = _serviceId,
            //    CustomerId = _customerId,
            //    WorkDescription = "Тестовое описание работ для калькуляции",
            //    ArchObjectId = archObjectId,
            //    Comment = "Тестовая заявка для проверки калькуляции"
            //};

            var application = await _apiClient.CreateApplication(_customerId, _serviceId, archObjectId, "Тестовое описание работ для полного цикла", "Тестовая заявка для полного цикла обработки");
            Assert.NotNull(application);
            _applicationId = application.Id;

            _output.WriteLine($"Создана новая заявка с ID: {_applicationId}");

            // Шаг 2: Формирование калькуляции основным отделом
            _output.WriteLine("Шаг 2: Формирование калькуляции основным отделом");

            // Создание задачи для основного отдела
            var mainTaskId = _testDataHelper.CreateApplicationTask(_applicationId, "Калькуляция основного отдела", _taskStatusAssignedId, _mainDepartmentId);
            Assert.NotEqual(0, mainTaskId);

            // Назначение исполнителя
            var mainAssigneeId = _testDataHelper.AssignTaskToEmployee(mainTaskId, _mainEmployeeId);
            Assert.NotEqual(0, mainAssigneeId);

            // Обновление статуса задачи на "В работе"
            await UpdateTaskStatus(mainTaskId, _taskStatusAtWorkId);

            // Создание калькуляции от основного отдела
            var mainPaymentId = _testDataHelper.CreatePayment(
                _applicationId,
                1000.00m,
                "Услуги основного отдела",
                _mainDepartmentId
            );

            var mainPayment = await GetPaymentById(mainPaymentId);
            Assert.NotNull(mainPayment);
            Assert.Equal(1000.00m, mainPayment.sum);

            // Обновление статуса задачи на "Выполнен"
            await UpdateTaskStatus(mainTaskId, _taskStatusDoneId);

            _output.WriteLine($"Создана калькуляция от основного отдела на сумму {mainPayment.sum}");

            // Шаг 3: Формирование калькуляции дополнительным отделом
            _output.WriteLine("Шаг 3: Формирование калькуляции дополнительным отделом");

            // Создание задачи для дополнительного отдела
            var additionalTaskId = _testDataHelper.CreateApplicationTask(_applicationId, "Калькуляция дополнительного отдела", _taskStatusAssignedId, _additionalDepartmentId);
            Assert.NotEqual(0, additionalTaskId);

            // Назначение исполнителя
            var additionalAssigneeId = _testDataHelper.AssignTaskToEmployee(additionalTaskId, _additionalEmployeeId);
            Assert.NotEqual(0, additionalAssigneeId);

            // Обновление статуса задачи на "В работе"
            await UpdateTaskStatus(additionalTaskId, _taskStatusAtWorkId);

            // Создание калькуляции от дополнительного отдела
            var additionalPaymentId = _testDataHelper.CreatePayment(
                _applicationId,
                500.00m,
                "Услуги дополнительного отдела",
                _additionalDepartmentId
            );

            var additionalPayment = await GetPaymentById(additionalPaymentId);
            Assert.NotNull(additionalPayment);
            Assert.Equal(500.00m, additionalPayment.sum);

            // Обновление статуса задачи на "Выполнен"
            await UpdateTaskStatus(additionalTaskId, _taskStatusDoneId);

            _output.WriteLine($"Создана калькуляция от дополнительного отдела на сумму {additionalPayment.sum}");

            // Шаг 4: Объединение калькуляций и вычисление общей суммы
            _output.WriteLine("Шаг 4: Объединение калькуляций и вычисление общей суммы");

            // Получение всех калькуляций по заявке
            var allPayments = await GetAllApplicationPayments(_applicationId);
            Assert.Equal(2, allPayments.Count);

            // Расчет общей суммы
            decimal totalSum = allPayments.Sum(p => p.sum);
            Assert.Equal(1500.00m, totalSum);

            // Обновление общей суммы в заявке
            await UpdateApplicationTotalSum(_applicationId, totalSum);

            _output.WriteLine($"Общая сумма калькуляции: {totalSum}");

            // Шаг 5: Проверка в плановом отделе
            _output.WriteLine("Шаг 5: Проверка калькуляции в плановом отделе");

            // Создание задачи для планового отдела
            var financeTaskId = _testDataHelper.CreateApplicationTask(_applicationId, "Проверка калькуляции", _taskStatusAssignedId, _financeDepartmentId);
            Assert.NotEqual(0, financeTaskId);

            // Назначение исполнителя
            var financeAssigneeId = _testDataHelper.AssignTaskToEmployee(financeTaskId, _financeEmployeeId);
            Assert.NotEqual(0, financeAssigneeId);

            // Обновление статуса задачи на "В работе"
            await UpdateTaskStatus(financeTaskId, _taskStatusAtWorkId);

            // Добавление примечания к калькуляции
            await AddCalculationNote(_applicationId, "Калькуляция проверена и утверждена");

            // Проверка и утверждение калькуляции
            await ApproveCalculation(_applicationId);

            // Обновление статуса задачи на "Выполнен"
            await UpdateTaskStatus(financeTaskId, _taskStatusDoneId);

            _output.WriteLine($"Калькуляция проверена и утверждена");

            // Финальная проверка
            _output.WriteLine("Шаг 6: Проверка итогового состояния калькуляции");

            // Проверяем, что в заявке установлена общая сумма
            var applicationWithSum = await GetApplicationWithSum(_applicationId);
            Assert.Equal(totalSum, applicationWithSum.total_sum);

            // Проверяем, что все задачи выполнены
            var allTasks = await GetAllApplicationTasks(_applicationId);
            Assert.All(allTasks, task => Assert.Equal(_taskStatusDoneId, task.status_id));

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

        private async Task<PaymentItem> GetPaymentById(int paymentId)
        {
            return DatabaseHelper.RunQueryList<PaymentItem>(_schemaName, @"
                SELECT id, application_id, description, sum::numeric, structure_id 
                FROM application_payment 
                WHERE id = @paymentId",
                reader => new PaymentItem
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    sum = reader.GetDecimal(3),
                    structure_id = reader.IsDBNull(4) ? (int?)null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@paymentId"] = paymentId }
            ).FirstOrDefault();
        }

        private async Task<List<PaymentItem>> GetAllApplicationPayments(int applicationId)
        {
            return DatabaseHelper.RunQueryList<PaymentItem>(_schemaName, @"
                SELECT id, application_id, description, sum::numeric, structure_id 
                FROM application_payment 
                WHERE application_id = @applicationId",
                reader => new PaymentItem
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    sum = reader.GetDecimal(3),
                    structure_id = reader.IsDBNull(4) ? (int?)null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@applicationId"] = applicationId }
            );
        }

        private async Task<List<ApplicationTask>> GetAllApplicationTasks(int applicationId)
        {
            return DatabaseHelper.RunQueryList<ApplicationTask>(_schemaName, @"
                SELECT id, name, status_id, structure_id 
                FROM application_task 
                WHERE application_id = @applicationId",
                reader => new ApplicationTask
                {
                    id = reader.GetInt32(0),
                    name = reader.IsDBNull(1) ? null : reader.GetString(1),
                    status_id = reader.GetInt32(2),
                    structure_id = reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)
                },
                new Dictionary<string, object> { ["@applicationId"] = applicationId }
            );
        }

        private async Task UpdateTaskStatus(int taskId, int statusId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application_task 
                SET status_id = @statusId, updated_at = @updated_at 
                WHERE id = @taskId",
                new Dictionary<string, object>
                {
                    ["@taskId"] = taskId,
                    ["@statusId"] = statusId,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task UpdateApplicationTotalSum(int applicationId, decimal totalSum)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application 
                SET total_sum = @totalSum, sum_wo_discount = @totalSum, updated_at = @updated_at 
                WHERE id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@totalSum"] = totalSum,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task AddCalculationNote(int applicationId, string comment)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_comment (application_id, comment, created_at, updated_at, created_by) 
                VALUES (@applicationId, @comment, @created_at, @updated_at, @created_by) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@comment"] = comment,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@created_by"] = _financeEmployeeId
                });
        }

        private async Task ApproveCalculation(int applicationId)
        {
            // Обновление заявки с флагом, что калькуляция утверждена
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application 
                SET has_discount = false, 
                    calc_updated_at = @updated_at, 
                    calc_updated_by = @updatedBy,
                    calc_created_at = @updated_at,
                    calc_created_by = @updatedBy
                WHERE id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@updated_at"] = DateTime.Now,
                    ["@updatedBy"] = _financeEmployeeId
                });
        }

        private async Task<ApplicationWithSum> GetApplicationWithSum(int applicationId)
        {
            return DatabaseHelper.RunQueryList<ApplicationWithSum>(_schemaName, @"
                SELECT id, total_sum::numeric, sum_wo_discount::numeric, calc_updated_at, calc_updated_by
                FROM application 
                WHERE id = @applicationId",
                reader => new ApplicationWithSum
                {
                    id = reader.GetInt32(0),
                    total_sum = reader.IsDBNull(1) ? 0m : reader.GetDecimal(1),
                    sum_wo_discount = reader.IsDBNull(2) ? 0m : reader.GetDecimal(2),
                    calc_updated_at = reader.IsDBNull(3) ? (DateTime?)null : reader.GetDateTime(3),
                    calc_updated_by = reader.IsDBNull(4) ? (int?)null : reader.GetInt32(4)
                },
                new Dictionary<string, object> { ["@applicationId"] = applicationId }
            ).FirstOrDefault();
        }

        #endregion

        #region Вспомогательные классы

        private class PaymentItem
        {
            public int id { get; set; }
            public int application_id { get; set; }
            public string description { get; set; }
            public decimal sum { get; set; }
            public int? structure_id { get; set; }
        }

        private class ApplicationTask
        {
            public int id { get; set; }
            public string name { get; set; }
            public int status_id { get; set; }
            public int? structure_id { get; set; }
        }

        private class ApplicationWithSum
        {
            public int id { get; set; }
            public decimal total_sum { get; set; }
            public decimal sum_wo_discount { get; set; }
            public DateTime? calc_updated_at { get; set; }
            public int? calc_updated_by { get; set; }
        }

        #endregion
    }
}