using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class LegalRecordEmployeeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public LegalRecordEmployeeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<LegalRecordEmployee>> GetAll()
        {
            return unitOfWork.legalRecordEmployeeRepository.GetAll();
        }

        public Task<LegalRecordEmployee> GetOne(int id)
        {
            return unitOfWork.legalRecordEmployeeRepository.GetOne(id);
        }

        public async Task<LegalRecordEmployee> Create(LegalRecordEmployee domain)
        {
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legalRecordEmployeeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<LegalRecordEmployee> Update(LegalRecordEmployee domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.legalRecordEmployeeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<LegalRecordEmployee>> GetPaginated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legalRecordEmployeeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legalRecordEmployeeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }

        public Task<List<LegalRecordEmployee>> GetByid_record(int id_record)
        {
            return unitOfWork.legalRecordEmployeeRepository.GetByIdRecord(id_record);
        }

        public Task<List<LegalRecordEmployee>> GetByid_structure_employee(int id_structure_employee)
        {
            return unitOfWork.legalRecordEmployeeRepository.GetByIdStructureEmployee(id_structure_employee);
        }
    }
}