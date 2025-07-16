using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class legal_objectUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public legal_objectUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<legal_object>> GetAll()
        {
            return unitOfWork.legal_objectRepository.GetAll();
        }
        public Task<legal_object> GetOne(int id)
        {
            return unitOfWork.legal_objectRepository.GetOne(id);
        }
        public async Task<legal_object> Create(legal_object domain)
        {
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legal_objectRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<legal_object> Update(legal_object domain)
        {
            domain.updated_at = DateTime.Now;
            await unitOfWork.legal_objectRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<legal_object>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legal_objectRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legal_objectRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



    }
}
