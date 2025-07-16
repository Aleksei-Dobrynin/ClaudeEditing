using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class legal_record_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public legal_record_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<legal_record_object>> GetAll()
        {
            return unitOfWork.legal_record_objectRepository.GetAll();
        }
        public Task<legal_record_object> GetOne(int id)
        {
            return unitOfWork.legal_record_objectRepository.GetOne(id);
        }
        public async Task<legal_record_object> Create(legal_record_object domain)
        {
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legal_record_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<legal_record_object> Update(legal_record_object domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.legal_record_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<legal_record_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legal_record_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legal_record_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<legal_record_object>> GetByid_record(int id_record)
        {
            return unitOfWork.legal_record_objectRepository.GetByid_record(id_record);
        }

        public Task<List<legal_record_object>> GetByid_object(int id_object)
        {
            return unitOfWork.legal_record_objectRepository.GetByid_object(id_object);
        }

    }
}
