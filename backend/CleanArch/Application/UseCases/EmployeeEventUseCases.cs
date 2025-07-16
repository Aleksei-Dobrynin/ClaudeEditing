using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class EmployeeEventUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public EmployeeEventUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<EmployeeEvent>> GetAll()
        {
            return unitOfWork.EmployeeEventRepository.GetAll();
        }
        
        public Task<List<EmployeeEvent>> GetByIDEmployee(int idEmployee)
        {
            return unitOfWork.EmployeeEventRepository.GetByIDEmployee(idEmployee);
        }
        
        public Task<EmployeeEvent> GetOneByID(int id)
        {
            return unitOfWork.EmployeeEventRepository.GetOneByID(id);
        }

        public async Task<EmployeeEvent> Create(EmployeeEvent domain)
        {
            var result = await unitOfWork.EmployeeEventRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            if (domain.temporary_employee_id != null)
            {
                var str_heads = await unitOfWork.EmployeeInStructureRepository.GetEmployeesHeadStructures(domain.employee_id ?? 0);
                for (int i = 0; i < str_heads.Count; i++)
                {
                    var x = new EmployeeInStructure
                    {
                        structure_id = str_heads[i].structure_id,
                        employee_id = domain.temporary_employee_id ?? 0,
                        is_temporary = true,
                        date_start = domain.date_start ?? DateTime.Now,
                        date_end = domain.date_end,
                        post_id = str_heads[i].post_id
                    };
                    await unitOfWork.EmployeeInStructureRepository.Add(x);
                    unitOfWork.Commit();
                }
            }
            return domain;
        }

        public async Task<EmployeeEvent> Update(EmployeeEvent domain)
        {
            await unitOfWork.EmployeeEventRepository.Update(domain);
            unitOfWork.Commit();
            if (domain.temporary_employee_id != null)
            {
                var str_heads = await unitOfWork.EmployeeInStructureRepository.GetEmployeesHeadStructures(domain.employee_id ?? 0);
                for (int i = 0; i < str_heads.Count; i++)
                {
                    var x = new EmployeeInStructure
                    {
                        structure_id = str_heads[i].structure_id,
                        employee_id = domain.temporary_employee_id ?? 0,
                        is_temporary = true,
                        date_start = domain.date_start ?? DateTime.Now,
                        date_end = domain.date_end,
                        post_id = str_heads[i].post_id
                    };
                    await unitOfWork.EmployeeInStructureRepository.Add(x);
                    unitOfWork.Commit();
                }
            }
            return domain;
        }

        public Task<PaginatedList<EmployeeEvent>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.EmployeeEventRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.EmployeeEventRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
