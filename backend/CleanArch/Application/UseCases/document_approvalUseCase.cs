using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class document_approvalUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public document_approvalUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<document_approval>> GetAll()
        {
            return unitOfWork.document_approvalRepository.GetAll();
        }
        public Task<document_approval> GetOne(int id)
        {
            return unitOfWork.document_approvalRepository.GetOne(id);
        }
        public async Task<document_approval> Create(document_approval domain)
        {
            var app_step = await unitOfWork.application_stepRepository.GetOne(domain.app_step_id ?? 0);
            var steps = await unitOfWork.application_stepRepository.GetByapplication_id(app_step.application_id ?? 0);
            var other_appr = await unitOfWork.document_approvalRepository.GetByAppStepIds(steps.Select(x => x.id).ToArray());
            var same_doc = other_appr.FirstOrDefault(x => x.document_type_id == domain.document_type_id);
            if(same_doc != null)
            {
                domain.app_document_id = same_doc.app_document_id;
            }

            var result = await unitOfWork.document_approvalRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<document_approval> Update(document_approval domain)
        {
            await unitOfWork.document_approvalRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<document_approval>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.document_approvalRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.document_approvalRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<document_approval>>  GetByapp_document_id(int app_document_id)
        {
            return unitOfWork.document_approvalRepository.GetByapp_document_id(app_document_id);
        }
        
        public Task<List<document_approval>>  GetByfile_sign_id(int file_sign_id)
        {
            return unitOfWork.document_approvalRepository.GetByfile_sign_id(file_sign_id);
        }
        
        public Task<List<document_approval>>  GetBydepartment_id(int department_id)
        {
            return unitOfWork.document_approvalRepository.GetBydepartment_id(department_id);
        }
        
        public Task<List<document_approval>>  GetByposition_id(int position_id)
        {
            return unitOfWork.document_approvalRepository.GetByposition_id(position_id);
        }

        /// <summary>
        /// Получает согласования с назначенными исполнителями
        /// Основной метод для получения полной информации о согласованиях
        /// Формат имени: "Иванов И.И. (Главный специалист Отдел архитектуры)"
        /// </summary>
        /// <param name="applicationId">ID заявки</param>
        /// <param name="stepId">ID этапа (опционально)</param>
        /// <returns>Список согласований с assigned_approvers, отсортированный по order_number (NULL в конец)</returns>
        public async Task<List<document_approval>> GetApprovalsWithAssignees(
            int applicationId,
            int? stepId = null)
        {
            // 1. Получаем все согласования с сортировкой по order_number (NULL в конец)
            var approvals = await unitOfWork.document_approvalRepository.GetByApplicationId(
                applicationId,
                stepId
            );

            if (approvals == null || !approvals.Any())
                return approvals ?? new List<document_approval>();

            // 2. Получаем всех назначенных исполнителей заявки
            var assignees = await unitOfWork.application_task_assigneeRepository
                .GetByapplication_id(applicationId);

            if (assignees == null || !assignees.Any())
            {
                // Если нет назначенных исполнителей, возвращаем пустые списки
                approvals.ForEach(a => a.assigned_approvers = new List<AssignedApprover>());
                return approvals;
            }

            // 3. Получаем информацию о сотрудниках из employee_in_structure
            var structureEmployeeIds = assignees
                .Select(a => a.structure_employee_id)
                .Distinct()
                .ToList();

            var employeesInStructure = await unitOfWork.EmployeeInStructureRepository
                .GetByIdsAsync(structureEmployeeIds);

            // 4. Для каждого approval находим подходящих исполнителей
            foreach (var approval in approvals)
            {
                approval.assigned_approvers = GetMatchingApprovers(
                    approval.department_id,
                    approval.position_id,
                    employeesInStructure
                );
            }

            return approvals;
        }



        /// <summary>
        /// Находит исполнителей, у которых совпадают отдел и должность
        /// Логика сопоставления:
        /// - employee_in_structure.structure_id == document_approval.department_id
        /// - employee_in_structure.post_id == document_approval.position_id
        /// - Сотрудник активен (проверка date_end)
        /// </summary>
        private List<AssignedApprover> GetMatchingApprovers(
            int? departmentId,
            int? positionId,
            List<EmployeeInStructure> employees)
        {
            if (!departmentId.HasValue || !positionId.HasValue)
                return new List<AssignedApprover>();

            var now = DateTime.UtcNow;

            var matching = employees
                .Where(e => e.structure_id == departmentId.Value
                         && e.post_id == positionId.Value
                         && IsEmployeeActive(e, now))
                .Select(e => new AssignedApprover
                {
                    employee_id = e.employee_id,
                    employee_fullname = e.employee_name,   // "Иванов Иван Иванович"
                    structure_employee_id = e.id,
                    post_name = e.post_name,
                    post_code = e.post_code,
                    structure_name = e.structure_name,
                })
                .OrderBy(a => a.employee_name)
                .ToList();

            return matching;
        }

        /// <summary>
        /// Проверяет, активен ли сотрудник на указанную дату
        /// Логика: date_start <= checkDate AND (date_end IS NULL OR date_end >= checkDate)
        /// </summary>
        private bool IsEmployeeActive(EmployeeInStructure employee, DateTime checkDate)
        {
            return employee.date_start <= checkDate
                && (!employee.date_end.HasValue || employee.date_end.Value >= checkDate);
        }

    }
}
