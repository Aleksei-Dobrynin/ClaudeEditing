using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class JournalPlaceholderUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public JournalPlaceholderUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<JournalPlaceholder>> GetAll()
        {
            return unitOfWork.JournalPlaceholderRepository.GetAll();
        }
        
        public Task<JournalPlaceholder> GetOneByID(int id)
        {
            return unitOfWork.JournalPlaceholderRepository.GetOneByID(id);
        }

        public async Task<JournalPlaceholder> Create(JournalPlaceholder domain)
        {
            var result = await unitOfWork.JournalPlaceholderRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<JournalPlaceholder> Update(JournalPlaceholder domain)
        {
            await unitOfWork.JournalPlaceholderRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<JournalPlaceholder>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.JournalPlaceholderRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.JournalPlaceholderRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
