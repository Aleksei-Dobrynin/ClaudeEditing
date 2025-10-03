using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class EmployeeSavedFiltersUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public EmployeeSavedFiltersUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<EmployeeSavedFilters>> GetAll()
        {
            return unitOfWork.EmployeeSavedFiltersRepository.GetAll();
        }

        public Task<EmployeeSavedFilters> GetOneByID(int id)
        {
            return unitOfWork.EmployeeSavedFiltersRepository.GetOneByID(id);
        }

        public async Task<List<EmployeeSavedFilters>> GetByEmployeeId()
        {

            var employee = await unitOfWork.EmployeeRepository.GetUser();
            var result = await unitOfWork.EmployeeSavedFiltersRepository.GetByEmployeeId(employee.id);
            return result;
        }

        public async Task<EmployeeSavedFilters> Create(EmployeeSavedFilters domain)
        {
            // Если это фильтр по умолчанию, сбросить флаг у других фильтров этого сотрудника
            if (domain.is_default == true)
            {
                await ResetDefaultFilterForEmployee(domain.employee_id);
            }
            var employee = await unitOfWork.EmployeeRepository.GetUser();
            domain.employee_id = employee.id;

            var result = await unitOfWork.EmployeeSavedFiltersRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<EmployeeSavedFilters> Update(EmployeeSavedFilters domain)
        {
            // Если это фильтр по умолчанию, сбросить флаг у других фильтров этого сотрудника
            if (domain.is_default == true)
            {
                await ResetDefaultFilterForEmployee(domain.employee_id, domain.id);
            }

            var employee = await unitOfWork.EmployeeRepository.GetUser();
            domain.employee_id = employee.id;
            await unitOfWork.EmployeeSavedFiltersRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<EmployeeSavedFilters>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.EmployeeSavedFiltersRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.EmployeeSavedFiltersRepository.Delete(id);
            unitOfWork.Commit();
        }

        // Вспомогательный метод для сброса флага is_default у других фильтров
        private async Task ResetDefaultFilterForEmployee(int employeeId, int? excludeId = null)
        {
            var employeeFilters = await unitOfWork.EmployeeSavedFiltersRepository.GetByEmployeeId(employeeId);

            foreach (var filter in employeeFilters)
            {
                if (excludeId != null && filter.id == excludeId)
                    continue;

                if (filter.is_default == true)
                {
                    filter.is_default = false;
                    await unitOfWork.EmployeeSavedFiltersRepository.Update(filter);
                }
            }
        }
    }
}