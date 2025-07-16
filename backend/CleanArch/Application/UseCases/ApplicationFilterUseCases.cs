using System.Text.Json;
using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationFilterUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationFilterUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ApplicationFilter>> GetAll()
        {
            return unitOfWork.ApplicationFilterRepository.GetAll();
        }

        public Task<ApplicationFilter> GetOneByID(int id)
        {
            return unitOfWork.ApplicationFilterRepository.GetOneByID(id);
        }

        public async Task<object> GetFilters()
        {
            var emp = await unitOfWork.EmployeeRepository.GetUser();
            var orgs = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
            var filter = new ApplicationFilterGetRequest
            {
                Posts = orgs.Select(org => org.post_id).ToList(),
                Structure = orgs.Select(org => org.structure_id).ToList()
            };

            var result = await unitOfWork.ApplicationFilterRepository.GetByFilter(filter);

            var filters = new List<object>();

            foreach (var item in result)
            {
                if (item.parameters != null)
                {
                    var parameters = JsonSerializer.Deserialize<ApplicationPaginationParameters>(item.parameters);
                    int[] structure_ids = null;

                    if (parameters?.isMyOrgApplication == true)
                    {
                        var emp1 = await unitOfWork.EmployeeRepository.GetUser();
                        var orgs2 = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
                        structure_ids = orgs.Select(org => org.structure_id).ToArray();
                    }

                    var data = await unitOfWork.ApplicationRepository.GetPaginated(
                        new PaginationFields {
                            pageSize = 1,
                            pageNumber = parameters.pageNumber,
                            sort_by = parameters.sort_by,
                            sort_type = parameters.sort_type,
                            pin = parameters.pin,
                            customerName = parameters.customerName,
                            date_start = parameters.date_start,
                            date_end = parameters.date_end,
                            service_ids = parameters.service_ids,
                            status_ids = parameters.status_ids,
                            address = parameters.address,
                            district_id = parameters.district_id,
                            number = parameters.number,
                            tag_id = parameters.tag_id,
                            isExpired = parameters.isExpired,
                            employee_id = parameters.employee_id,
                            useCommon = parameters.useCommon,
                            common_filter = parameters.common_filter,
                            deadline_day = parameters.deadline_day,
                            withoutAssignedEmployee = parameters.withoutAssignedEmployee,
                            structure_ids = structure_ids,
                        
                        }, true, false
                        );
                    
                    filters.Add(new 
                    {
                        id = item.id,
                        name = item.name,
                        code = item.code, 
                        count = data.TotalCount,
                        type_id = item.type_id,
                        type_name = item.type_name, 
                        type_code = item.type_code,
                        filter = item.parameters,
                    });
                }
            }
            return filters;
        }

        public async Task<ApplicationFilter> Create(ApplicationFilter domain)
        {
            var result = await unitOfWork.ApplicationFilterRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ApplicationFilter> Update(ApplicationFilter domain)
        {
            await unitOfWork.ApplicationFilterRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ApplicationFilter>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationFilterRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ApplicationFilterRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}