using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class LawDocumentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public LawDocumentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<LawDocument>> GetAll()
        {
            return unitOfWork.LawDocumentRepository.GetAll();
        }
        
        public Task<LawDocument> GetOneByID(int id)
        {
            return unitOfWork.LawDocumentRepository.GetOneByID(id);
        }

        public async Task<LawDocument> Create(LawDocument domain)
        {
            var result = await unitOfWork.LawDocumentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<LawDocument> Update(LawDocument domain)
        {
            await unitOfWork.LawDocumentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<LawDocument>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.LawDocumentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.LawDocumentRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
