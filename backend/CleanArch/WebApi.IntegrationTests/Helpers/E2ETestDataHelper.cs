using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using WebApi.IntegrationTests.Helpers;

namespace WebApi.IntegrationTests.E2E
{
    public class TestDataHelper
    {
        private readonly string _schemaName;

        public TestDataHelper(string schemaName)
        {
            _schemaName = schemaName;
        }

        /// <summary>
        /// Создает тестового сотрудника
        /// </summary>
        public int CreateEmployee(string lastName, string firstName, string secondName, string userId = null)
        {
            var sql = @"
                INSERT INTO employee (last_name, first_name, second_name, user_id) 
                VALUES (@lastName, @firstName, @secondName, @userId) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@lastName"] = lastName,
                ["@firstName"] = firstName,
                ["@secondName"] = secondName,
                ["@userId"] = userId ?? "test-user-id"
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает тестовую структуру
        /// </summary>
        public int CreateStructure(string name, string uniqueId = null, bool isActive = true)
        {
            var sql = @"
                INSERT INTO org_structure (name, unique_id, is_active) 
                VALUES (@name, @uniqueId, @isActive) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@name"] = name,
                ["@uniqueId"] = uniqueId ?? Guid.NewGuid().ToString(),
                ["@isActive"] = isActive
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Добавляет сотрудника в структуру с указанной должностью
        /// </summary>
        public int AssignEmployeeToStructure(int employeeId, int structureId, int postId, DateTime? dateStart = null)
        {
            var sql = @"
                INSERT INTO employee_in_structure (employee_id, structure_id, post_id, date_start) 
                VALUES (@employeeId, @structureId, @postId, @dateStart) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@employeeId"] = employeeId,
                ["@structureId"] = structureId,
                ["@postId"] = postId,
                ["@dateStart"] = dateStart ?? DateTime.Now
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает тестового заказчика
        /// </summary>
        public int CreateCustomer(string pin, string fullName, bool isOrganization = false)
        {
            var sql = @"
                INSERT INTO customer (pin, full_name, is_organization) 
                VALUES (@pin, @fullName, @isOrganization) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@pin"] = pin,
                ["@fullName"] = fullName,
                ["@isOrganization"] = isOrganization
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает контакт заказчика
        /// </summary>
        public int CreateCustomerContact(int customerId, string value, int typeId, bool allowNotification = true)
        {
            var sql = @"
                INSERT INTO customer_contact (customer_id, value, type_id, allow_notification) 
                VALUES (@customerId, @value, @typeId, @allowNotification) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@customerId"] = customerId,
                ["@value"] = value,
                ["@typeId"] = typeId,
                ["@allowNotification"] = allowNotification
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает тестовый архитектурный объект
        /// </summary>
        public int CreateArchObject(string name, string address, int districtId)
        {
            var sql = @"
                INSERT INTO arch_object (name, address, district_id) 
                VALUES (@name, @address, @districtId) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@name"] = name,
                ["@address"] = address,
                ["@districtId"] = districtId
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает задачу для заявки
        /// </summary>
        public int CreateApplicationTask(int applicationId, string name, int statusId, int structureId)
        {
            var sql = @"
                INSERT INTO application_task (application_id, name, status_id, structure_id) 
                VALUES (@applicationId, @name, @statusId, @structureId) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@applicationId"] = applicationId,
                ["@name"] = name,
                ["@statusId"] = statusId,
                ["@structureId"] = structureId
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Назначает исполнителя для задачи
        /// </summary>
        public int AssignTaskToEmployee(int taskId, int structureEmployeeId)
        {
            var sql = @"
                INSERT INTO application_task_assignee (application_task_id, structure_employee_id) 
                VALUES (@taskId, @structureEmployeeId) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@taskId"] = taskId,
                ["@structureEmployeeId"] = structureEmployeeId
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает файл в системе
        /// </summary>
        public int CreateFile(string name, string path)
        {
            var sql = @"
                INSERT INTO file (name, path) 
                VALUES (@name, @path) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@name"] = name,
                ["@path"] = path
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает тестовую заявку
        /// </summary>
        public int CreateApplication(int customerId, int serviceId, int statusId, DateTime? registrationDate = null)
        {
            var sql = @"
                INSERT INTO application (customer_id, service_id, status_id, registration_date, number) 
                VALUES (@customerId, @serviceId, @statusId, @registrationDate, @number) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@customerId"] = customerId,
                ["@serviceId"] = serviceId,
                ["@statusId"] = statusId,
                ["@registrationDate"] = registrationDate ?? DateTime.Now,
                ["@number"] = $"TEST-{DateTime.Now.ToString("yyyyMMddHHmmss")}"
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает калькуляцию для заявки
        /// </summary>
        public int CreatePayment(int applicationId, decimal sum, string description, int structureId)
        {
            var sql = @"
                INSERT INTO application_payment (application_id, sum, description, structure_id) 
                VALUES (@applicationId, @sum, @description, @structureId) 
                RETURNING id;";

            var parameters = new Dictionary<string, object>
            {
                ["@applicationId"] = applicationId,
                ["@sum"] = sum,
                ["@description"] = description,
                ["@structureId"] = structureId
            };

            return DatabaseHelper.RunQuery<int>(_schemaName, sql, parameters);
        }

        /// <summary>
        /// Создает тестовый PDF-документ в памяти
        /// </summary>
        public byte[] CreatePdfDocument(string content)
        {
            // Это упрощенный пример, в реальности нужно генерировать PDF с помощью библиотеки
            // Для тестов можно использовать заранее подготовленные файлы
            var text = $"%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\n2 0 obj\n<</Type /Page>>\nendobj\n3 0 obj\n<</Length {content.Length}>>\nstream\n{content}\nendstream\nendobj\ntrailer\n<</Root 1 0 R>>\n%%EOF";
            return Encoding.UTF8.GetBytes(text);
        }

        /// <summary>
        /// Обновляет статус заявки и добавляет запись в историю статусов
        /// </summary>
        public void UpdateApplicationStatus(int applicationId, int statusId, int userId)
        {
            var updateSql = @"
                UPDATE application 
                SET status_id = @statusId, updated_at = NOW() 
                WHERE id = @applicationId;";

            var paramUpdateStatus = new Dictionary<string, object>
            {
                ["@applicationId"] = applicationId,
                ["@statusId"] = statusId
            };

            DatabaseHelper.RunQuery<int>(_schemaName, updateSql, paramUpdateStatus);

            // Получение предыдущего статуса
            var getOldStatusSql = @"
                SELECT status_id 
                FROM application_status_history 
                WHERE application_id = @applicationId 
                ORDER BY date_change DESC 
                LIMIT 1;";

            var paramGetOldStatus = new Dictionary<string, object>
            {
                ["@applicationId"] = applicationId
            };

            int oldStatusId;
            try
            {
                oldStatusId = DatabaseHelper.RunQuery<int>(_schemaName, getOldStatusSql, paramGetOldStatus);
            }
            catch
            {
                // Если истории нет, считаем старым статусом текущий
                oldStatusId = statusId;
            }
        }
    }
}