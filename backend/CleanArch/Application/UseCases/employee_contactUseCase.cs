using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;

namespace Application.UseCases
{
    public class employee_contactUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public employee_contactUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<employee_contact>> GetAll()
        {
            return unitOfWork.employee_contactRepository.GetAll();
        }   
        
        public async Task<List<employee_contact>> GetByIDEmployee(int idEmployee)
        {
            var all = await unitOfWork.employee_contactRepository.GetAll();
            var res = all.Where(x=>x.employee_id == idEmployee).ToList();
            return res;
        }
        public Task<employee_contact> GetOne(int id)
        {
            return unitOfWork.employee_contactRepository.GetOne(id);
        }
        public async Task<employee_contact> Create(employee_contact domain)
        {
            var result = await unitOfWork.employee_contactRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<employee_contact> Update(employee_contact domain)
        {
            await unitOfWork.employee_contactRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }
        public async Task<Result<int>> SetTelegramContact(SetTelegramContact domain)
        {
            var telegram_contact_type = await unitOfWork.contact_typeRepository.GetOneByCode("telegram");
            var emp = await unitOfWork.EmployeeRepository.GetOneByGuid(domain.guid);
            if(emp == null || telegram_contact_type == null)
            {
                return Result.Fail(new LogicError("Сотрудник не найден!"));
            }
            var emp_con = new employee_contact
            {
                type_id = telegram_contact_type.id,
                allow_notification = true,
                value = domain.chat_id.ToString(),
                employee_id = emp.id
            };

            var res = await unitOfWork.employee_contactRepository.Add(emp_con);
            unitOfWork.Commit();
            return res;
        }
        
        public Task<PaginatedList<employee_contact>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.employee_contactRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.employee_contactRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
