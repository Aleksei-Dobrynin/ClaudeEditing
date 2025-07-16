using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class document_statusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public document_statusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<document_status>> GetAll()
        {
            return unitOfWork.document_statusRepository.GetAll();
        }
        public Task<document_status> GetOne(int id)
        {
            return unitOfWork.document_statusRepository.GetOne(id);
        }
        public async Task<document_status> Create(document_status domain)
        {
            var result = await unitOfWork.document_statusRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<document_status> Update(document_status domain)
        {
            await unitOfWork.document_statusRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<document_status>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.document_statusRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.document_statusRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
