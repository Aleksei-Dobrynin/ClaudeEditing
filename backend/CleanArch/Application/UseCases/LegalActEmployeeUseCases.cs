using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class LegalActEmployeeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public LegalActEmployeeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<LegalActEmployee>> GetAll()
        {
            return unitOfWork.legalActEmployeeRepository.GetAll();
        }

        public Task<LegalActEmployee> GetOne(int id)
        {
            return unitOfWork.legalActEmployeeRepository.GetOne(id);
        }

        public async Task<LegalActEmployee> Create(LegalActEmployee domain)
        {
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legalActEmployeeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<LegalActEmployee> Update(LegalActEmployee domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.legalActEmployeeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<LegalActEmployee>> GetPaginated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legalActEmployeeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legalActEmployeeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }

        public Task<List<LegalActEmployee>> GetByid_act(int id_act)
        {
            return unitOfWork.legalActEmployeeRepository.GetByIdAct(id_act);
        }

        public Task<List<LegalActEmployee>> GetByid_structure_employee(int id_structure_employee)
        {
            return unitOfWork.legalActEmployeeRepository.GetByIdStructureEmployee(id_structure_employee);
        }
    }
}