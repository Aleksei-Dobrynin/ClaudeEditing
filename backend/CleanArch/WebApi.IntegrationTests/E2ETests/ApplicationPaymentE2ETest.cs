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
    /// E2E тест для проверки процесса оплаты и подтверждения оплаты по заявке:
    /// - Формирование счета на оплату
    /// - Регистрация оплаты
    /// - Проверка отображения оплаты
    /// - Внесение данных об оплате вручную
    /// - Ввод заявки в реестр
    /// </summary>
    [Collection("Database collection")]
    public class ApplicationPaymentE2ETest : BaseE2ETest
    {
        private readonly ApiClient _apiClient;
        private readonly ITestOutputHelper _output;

        // Тестовые данные
        private int _customerId;
        private int _serviceId;
        private int _districtId;
        private int _applicationId;
        private int _financeDepartmentId;
        private int _registryDepartmentId;
        private int _financeEmployeeId;
        private int _registryEmployeeId;
        private int _financePostId;
        private int _registrarPostId;
        private int _invoiceId;
        private decimal _paymentAmount = 2000.00m;

        // Статусы из SeedData.sql
        private readonly int _statusReviewId = 1; // "Прием заявления"
        private readonly int _statusDocumentReadyId = 6; // "Пакет документов готов к выдаче"
        private readonly int _statusDoneId = 2; // "Реализован"

        private int _invoiceStatusNewId = 1; // Значение по умолчанию
        private int _invoiceStatusPaidId = 2; // Значение по умолчанию

        public ApplicationPaymentE2ETest(ITestOutputHelper output)
            : base()
        {
            _output = output;
            _apiClient = new ApiClient(_client);
        }

        protected override async Task SeedTestDataAsync()
        {
            _output.WriteLine("Начало SeedTestDataAsync");
            _output.WriteLine($"_schemaName = {_schemaName}");
            _output.WriteLine($"_client = {(_client != null ? "инициализирован" : "null")}");
            _output.WriteLine($"_testDataHelper = {(_testDataHelper != null ? "инициализирован" : "null")}");

            try
            {
                // 1. Базовые справочники из SeedData.sql
                _serviceId = 1; // Первая услуга из сида
                _districtId = 1; // Первомайский район

                // 2. Создание заказчика
                _customerId = _testDataHelper.CreateCustomer("12345678903", "Тестовый заказчик для оплаты", false);

                // 3. Создание финансового отдела и отдела реестров
                _financeDepartmentId = _testDataHelper.CreateStructure("Финансовый отдел");
                _registryDepartmentId = _testDataHelper.CreateStructure("Отдел реестров");

                // 4. Создание должностей из структуры проекта
                _financePostId = await GetPostIdByCode("accountant");
                if (_financePostId == 0)
                {
                    _financePostId = await CreateStructurePost("Бухгалтер", "accountant");
                }

                _registrarPostId = await GetPostIdByCode("registrar");
                if (_registrarPostId == 0)
                {
                    _registrarPostId = await CreateStructurePost("Регистратор", "registrar");
                }

                // 5. Создание сотрудников
                _financeEmployeeId = _testDataHelper.CreateEmployee("Финансист", "Тестович", "Платежов");
                _registryEmployeeId = _testDataHelper.CreateEmployee("Регистратор", "Тестович", "Реестров");

                // 6. Привязка сотрудников к структуре
                var financeEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_financeEmployeeId, _financeDepartmentId, _financePostId);
                var registryEmployeeInStructure = _testDataHelper.AssignEmployeeToStructure(_registryEmployeeId, _registryDepartmentId, _registrarPostId);

                // 7. Создание статусов счетов (если они не созданы)
                await CreateInvoiceStatusesIfNeeded();
            }
            catch (Exception ex)
            {
                _output.WriteLine($"Исключение в SeedTestDataAsync: {ex.Message}");
                _output.WriteLine($"StackTrace: {ex.StackTrace}");
                throw;
            }
        }

        [Fact]
        public async Task CompletePaymentProcess_FromInvoiceToConfirmation_Success()
        {

            await InitializeTestAsync();
            // Шаг 1: Создание заявки с калькуляцией
            _output.WriteLine("Шаг 1: Создание новой заявки с калькуляцией");

            var archObjectId = _testDataHelper.CreateArchObject(
                "Тестовый объект для оплаты",
                "г. Бишкек, ул. Финансовая, д. 789",
                _districtId
            );

            //var createApplicationRequest = new CreateApplicationRequest
            //{
            //    RegistrationDate = DateTime.Now,
            //    ServiceId = _serviceId,
            //    CustomerId = _customerId,
            //    WorkDescription = "Тестовое описание работ для оплаты",
            //    ArchObjectId = archObjectId,
            //    Comment = "Тестовая заявка для проверки процесса оплаты"
            //};

            var application = await _apiClient.CreateApplication(_customerId, _serviceId, archObjectId, "Тестовое описание работ для полного цикла", "Тестовая заявка для полного цикла обработки");
            Assert.NotNull(application);
            _applicationId = application.Id;

            _output.WriteLine($"Создана новая заявка с ID: {_applicationId}");

            // Создание калькуляции
            var paymentId = _testDataHelper.CreatePayment(
                _applicationId,
                _paymentAmount,
                "Услуги по заявке",
                _financeDepartmentId
            );
            Assert.NotEqual(0, paymentId);

            // Обновление общей суммы в заявке
            await UpdateApplicationTotalSum(_applicationId, _paymentAmount);

            _output.WriteLine($"Создана калькуляция на сумму {_paymentAmount}");

            // Шаг 2: Формирование счета на оплату
            _output.WriteLine("Шаг 2: Формирование счета на оплату");

            _invoiceId = await CreateInvoice(_applicationId, _invoiceStatusNewId, _paymentAmount);
            Assert.NotEqual(0, _invoiceId);

            var invoice = await GetInvoiceById(_invoiceId);
            Assert.NotNull(invoice);
            Assert.Equal(_paymentAmount, invoice.sum);

            _output.WriteLine($"Создан счет на оплату с ID: {_invoiceId} на сумму {invoice.sum}");

            // Переводим заявку в статус "Документы готовы к выдаче"
            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusDocumentReadyId, _financeEmployeeId);

            var readyApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDocumentReadyId, readyApplication.status_id);

            // Шаг 3: Регистрация оплаты
            _output.WriteLine("Шаг 3: Регистрация оплаты");

            string paymentIdentifier = $"PAY-{DateTime.Now:yyyyMMddHHmmss}";
            string bankIdentifier = "Тестовый Банк";

            var paidInvoiceId = await RegisterPayment(
                _applicationId,
                _invoiceId,
                _paymentAmount,
                paymentIdentifier,
                bankIdentifier
            );
            Assert.NotEqual(0, paidInvoiceId);

            var paidInvoice = await GetPaidInvoiceById(paidInvoiceId);
            Assert.NotNull(paidInvoice);
            Assert.Equal(_paymentAmount, paidInvoice.sum);
            Assert.Equal(paymentIdentifier, paidInvoice.payment_identifier);

            _output.WriteLine($"Зарегистрирована оплата с ID: {paidInvoiceId}, идентификатор платежа: {paymentIdentifier}");

            // Шаг 4: Обновление статуса счета
            _output.WriteLine("Шаг 4: Обновление статуса счета на 'Оплачен'");

            await UpdateInvoiceStatus(_invoiceId, _invoiceStatusPaidId);

            var updatedInvoice = await GetInvoiceById(_invoiceId);
            Assert.Equal(_invoiceStatusPaidId, updatedInvoice.status_id);

            _output.WriteLine($"Обновлен статус счета на 'Оплачен'");

            // Обновление поля total_payed в заявке
            await UpdateApplicationTotalPayed(_applicationId, _paymentAmount);

            // Шаг 5: Обновление статуса заявки на "Реализован" после оплаты
            _output.WriteLine("Шаг 5: Обновление статуса заявки на 'Реализован'");

            _testDataHelper.UpdateApplicationStatus(_applicationId, _statusDoneId, _financeEmployeeId);

            var completedApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDoneId, completedApplication.status_id);

            _output.WriteLine($"Обновлен статус заявки на 'Реализован'");

            // Добавление комментария об оплате
            await AddPaymentComment(_applicationId, $"Оплата подтверждена, счет №{_invoiceId}, сумма {_paymentAmount}");

            // Шаг 6: Ввод заявки в реестр
            _output.WriteLine("Шаг 6: Ввод заявки в реестр");

            var reestrStatusId = await CreateReestrStatusIfNeeded();
            var reestrId = await CreateReestr("Тестовый реестр оплаченных заявок", DateTime.Now.Month, DateTime.Now.Year, reestrStatusId);
            var applicationInReestrId = await AddApplicationToReestr(reestrId, _applicationId);
            Assert.NotEqual(0, applicationInReestrId);

            _output.WriteLine($"Заявка добавлена в реестр с ID: {reestrId}");

            // Финальная проверка
            _output.WriteLine("Шаг 7: Проверка итогового состояния оплаты");

            var finalApplication = await _apiClient.GetApplicationById(_applicationId);
            Assert.Equal(_statusDoneId, finalApplication.status_id);

            // Проверка суммы оплаты в заявке
            var totalPayed = await GetApplicationTotalPayed(_applicationId);
            Assert.Equal(_paymentAmount, totalPayed);

            // Проверка наличия заявки в реестре
            var inReestr = await CheckApplicationInReestr(reestrId, _applicationId);
            Assert.True(inReestr);

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

        private async Task CreateInvoiceStatusesIfNeeded()
        {
            try
            {
                // Проверяем, что _schemaName не null
                if (string.IsNullOrEmpty(_schemaName))
                {
                    _output.WriteLine("ОШИБКА: _schemaName не инициализирован");
                    throw new InvalidOperationException("_schemaName не инициализирован");
                }

                // Проверяем существование таблицы
                try
                {
                    // Проверяем наличие статусов счетов
                    var statusCountQuery = $@"
                SELECT COUNT(*) 
                FROM information_schema.tables
                WHERE table_schema = '{_schemaName}'
                AND table_name = 'invoice_status'";

                    _output.WriteLine($"Выполнение SQL: {statusCountQuery}");

                    var tableExists = DatabaseHelper.RunQuery<int>(_schemaName, statusCountQuery);

                    if (tableExists == 0)
                    {
                        _output.WriteLine("Таблица invoice_status не существует, создаем...");

                        // Создаем таблицу
                        var createTableQuery = @"
                    CREATE TABLE invoice_status (
                        id serial primary key,
                        name varchar,
                        code varchar,
                        description varchar,
                        created_at timestamp,
                        updated_at timestamp,
                        created_by integer,
                        updated_by integer
                    )";

                        DatabaseHelper.RunQuery<int>(_schemaName, createTableQuery);
                        _output.WriteLine("Таблица invoice_status создана успешно");
                    }
                    else
                    {
                        _output.WriteLine("Таблица invoice_status уже существует");
                    }

                    // Проверяем наличие записей
                    var countQuery = "SELECT COUNT(*) FROM invoice_status";
                    _output.WriteLine($"Выполнение SQL: {countQuery}");

                    var statusCount = DatabaseHelper.RunQuery<int>(_schemaName, countQuery);
                    _output.WriteLine($"Количество статусов в таблице: {statusCount}");

                    if (statusCount == 0)
                    {
                        _output.WriteLine("Создаем статусы счетов...");

                        // Создаем статусы
                        var now = DateTime.Now;
                        var insertNewQuery = @"
                    INSERT INTO invoice_status (name, code, created_at, updated_at) 
                    VALUES ('Новый', 'new', @date, @date) 
                    RETURNING id";

                        var parameters1 = new Dictionary<string, object> { ["@date"] = now };

                        _invoiceStatusNewId = DatabaseHelper.RunQuery<int>(_schemaName, insertNewQuery, parameters1);
                        _output.WriteLine($"Создан статус 'Новый' с ID: {_invoiceStatusNewId}");

                        var insertPaidQuery = @"
                    INSERT INTO invoice_status (name, code, created_at, updated_at) 
                    VALUES ('Оплачен', 'paid', @date, @date) 
                    RETURNING id";

                        var parameters2 = new Dictionary<string, object> { ["@date"] = now };

                        _invoiceStatusPaidId = DatabaseHelper.RunQuery<int>(_schemaName, insertPaidQuery, parameters2);
                        _output.WriteLine($"Создан статус 'Оплачен' с ID: {_invoiceStatusPaidId}");
                    }
                    else
                    {
                        _output.WriteLine("Получаем существующие статусы счетов...");

                        // Получаем ID существующих статусов
                        var getNewIdQuery = @"
                    SELECT id FROM invoice_status 
                    WHERE code = 'new' OR LOWER(name) = 'новый' OR id = 1 
                    LIMIT 1";

                        _invoiceStatusNewId = DatabaseHelper.RunQuery<int>(_schemaName, getNewIdQuery);
                        _output.WriteLine($"Найден статус 'Новый' с ID: {_invoiceStatusNewId}");

                        var getPaidIdQuery = @"
                    SELECT id FROM invoice_status 
                    WHERE code = 'paid' OR LOWER(name) = 'оплачен' OR id = 2 
                    LIMIT 1";

                        _invoiceStatusPaidId = DatabaseHelper.RunQuery<int>(_schemaName, getPaidIdQuery);
                        _output.WriteLine($"Найден статус 'Оплачен' с ID: {_invoiceStatusPaidId}");
                    }

                    _output.WriteLine($"Статусы счетов инициализированы: Новый (ID: {_invoiceStatusNewId}), Оплачен (ID: {_invoiceStatusPaidId})");
                }
                catch (Exception ex)
                {
                    _output.WriteLine($"Ошибка при работе с БД: {ex.Message}");
                    _output.WriteLine($"StackTrace: {ex.StackTrace}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _output.WriteLine($"Общая ошибка в CreateInvoiceStatusesIfNeeded: {ex.Message}");
                _output.WriteLine($"StackTrace: {ex.StackTrace}");

                // Инициализируем значения по умолчанию, чтобы избежать NullReferenceException
                _invoiceStatusNewId = 1;
                _invoiceStatusPaidId = 2;

                throw;
            }
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

        private async Task<int> CreateInvoice(int applicationId, int statusId, decimal sum)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_invoice (application_id, status_id, sum, total_sum, created_at, updated_at) 
                VALUES (@applicationId, @statusId, @sum, @totalSum, @created_at, @updated_at) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@statusId"] = statusId,
                    ["@sum"] = sum,
                    ["@totalSum"] = sum,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task<Invoice> GetInvoiceById(int invoiceId)
        {
            return DatabaseHelper.RunQueryList<Invoice>(_schemaName, @"
                SELECT id, application_id, status_id, sum::numeric, total_sum::numeric 
                FROM application_invoice 
                WHERE id = @invoiceId",
                reader => new Invoice
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    status_id = reader.GetInt32(2),
                    sum = reader.GetDecimal(3),
                    total_sum = reader.GetDecimal(4)
                },
                new Dictionary<string, object> { ["@invoiceId"] = invoiceId }
            ).FirstOrDefault();
        }

        private async Task<int> RegisterPayment(int applicationId, int invoiceId, decimal sum, string paymentIdentifier, string bankIdentifier)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_paid_invoice (application_id, invoice_id, sum, payment_identifier, bank_identifier, date, created_at, updated_at, created_by) 
                VALUES (@applicationId, @invoiceId, @sum, @paymentIdentifier, @bankIdentifier, @date, @created_at, @updated_at, @created_by) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@invoiceId"] = invoiceId,
                    ["@sum"] = sum,
                    ["@paymentIdentifier"] = paymentIdentifier,
                    ["@bankIdentifier"] = bankIdentifier,
                    ["@date"] = DateTime.Now,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@created_by"] = _financeEmployeeId
                });
        }

        private async Task<PaidInvoice> GetPaidInvoiceById(int paidInvoiceId)
        {
            return DatabaseHelper.RunQueryList<PaidInvoice>(_schemaName, @"
                SELECT id, application_id, invoice_id, sum::numeric, payment_identifier, bank_identifier, date 
                FROM application_paid_invoice 
                WHERE id = @paidInvoiceId",
                reader => new PaidInvoice
                {
                    id = reader.GetInt32(0),
                    application_id = reader.GetInt32(1),
                    invoice_id = reader.IsDBNull(2) ? (int?)null : reader.GetInt32(2),
                    sum = reader.GetDecimal(3),
                    payment_identifier = reader.IsDBNull(4) ? null : reader.GetString(4),
                    bank_identifier = reader.IsDBNull(5) ? null : reader.GetString(5),
                    date = reader.IsDBNull(6) ? (DateTime?)null : reader.GetDateTime(6)
                },
                new Dictionary<string, object> { ["@paidInvoiceId"] = paidInvoiceId }
            ).FirstOrDefault();
        }

        private async Task UpdateInvoiceStatus(int invoiceId, int statusId)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application_invoice 
                SET status_id = @statusId, updated_at = @updated_at, updated_by = @updated_by
                WHERE id = @invoiceId",
                new Dictionary<string, object>
                {
                    ["@invoiceId"] = invoiceId,
                    ["@statusId"] = statusId,
                    ["@updated_at"] = DateTime.Now,
                    ["@updated_by"] = _financeEmployeeId
                });
        }

        private async Task UpdateApplicationTotalPayed(int applicationId, decimal amount)
        {
            DatabaseHelper.RunQuery<int>(_schemaName, @"
                UPDATE application 
                SET total_payed = @amount, updated_at = @updated_at
                WHERE id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@applicationId"] = applicationId,
                    ["@amount"] = amount,
                    ["@updated_at"] = DateTime.Now
                });
        }

        private async Task AddPaymentComment(int applicationId, string comment)
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

        private async Task<int> CreateReestrStatusIfNeeded()
        {
            // Проверка наличия статуса реестра
            var statusCount = DatabaseHelper.RunQuery<int>(_schemaName,
                "SELECT COUNT(*) FROM reestr_status");

            if (statusCount == 0)
            {
                // Создаем статус реестра
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    INSERT INTO reestr_status (id, name, code, created_at, updated_at) 
                    VALUES (1, 'Новый', 'new', @date, @date)
                    RETURNING id;",
                    new Dictionary<string, object> { ["@date"] = DateTime.Now });
            }
            else
            {
                // Получаем ID существующего статуса
                return DatabaseHelper.RunQuery<int>(_schemaName, @"
                    SELECT id FROM reestr_status 
                    LIMIT 1");
            }
        }

        private async Task<int> CreateReestr(string name, int month, int year, int statusId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO reestr (name, month, year, status_id, created_at, updated_at, created_by) 
                VALUES (@name, @month, @year, @statusId, @created_at, @updated_at, @created_by) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@name"] = name,
                    ["@month"] = month,
                    ["@year"] = year,
                    ["@statusId"] = statusId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@created_by"] = _registryEmployeeId
                });
        }

        private async Task<int> AddApplicationToReestr(int reestrId, int applicationId)
        {
            return DatabaseHelper.RunQuery<int>(_schemaName, @"
                INSERT INTO application_in_reestr (reestr_id, application_id, created_at, updated_at, created_by) 
                VALUES (@reestrId, @applicationId, @created_at, @updated_at, @created_by) 
                RETURNING id;",
                new Dictionary<string, object>
                {
                    ["@reestrId"] = reestrId,
                    ["@applicationId"] = applicationId,
                    ["@created_at"] = DateTime.Now,
                    ["@updated_at"] = DateTime.Now,
                    ["@created_by"] = _registryEmployeeId
                });
        }

        private async Task<decimal> GetApplicationTotalPayed(int applicationId)
        {
            var totalPayed = DatabaseHelper.RunQuery<decimal>(_schemaName, @"
                SELECT COALESCE(total_payed, 0)::numeric  
                FROM application 
                WHERE id = @applicationId",
                new Dictionary<string, object> { ["@applicationId"] = applicationId });
            
            return totalPayed;
        }

        private async Task<bool> CheckApplicationInReestr(int reestrId, int applicationId)
        {
            var count = DatabaseHelper.RunQuery<int>(_schemaName, @"
                SELECT COUNT(*) 
                FROM application_in_reestr 
                WHERE reestr_id = @reestrId AND application_id = @applicationId",
                new Dictionary<string, object>
                {
                    ["@reestrId"] = reestrId,
                    ["@applicationId"] = applicationId
                });

            return count > 0;
        }

        #endregion

        #region Вспомогательные классы

        private class Invoice
        {
            public int id { get; set; }
            public int application_id { get; set; }
            public int status_id { get; set; }
            public decimal sum { get; set; }
            public decimal total_sum { get; set; }
        }

        private class PaidInvoice
        {
            public int id { get; set; }
            public int application_id { get; set; }
            public int? invoice_id { get; set; }
            public decimal sum { get; set; }
            public string payment_identifier { get; set; }
            public string bank_identifier { get; set; }
            public DateTime? date { get; set; }
        }

        #endregion
    }
}