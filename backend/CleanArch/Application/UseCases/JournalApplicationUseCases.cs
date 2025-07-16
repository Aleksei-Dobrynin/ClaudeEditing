using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class JournalApplicationUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public JournalApplicationUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<JournalApplication>> GetAll()
        {
            return unitOfWork.JournalApplicationRepository.GetAll();
        }
        
        public Task<JournalApplication> GetOneByID(int id)
        {
            return unitOfWork.JournalApplicationRepository.GetOneByID(id);
        }

        public async Task<JournalApplication> Create(JournalApplication domain)
        {
            var result = await unitOfWork.JournalApplicationRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<JournalApplication> Update(JournalApplication domain)
        {
            await unitOfWork.JournalApplicationRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<JournalApplication>> GetPagniated(int pageSize, int pageNumber, string? sortBy, string? sortDir, int journalsId)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            if (string.IsNullOrWhiteSpace(sortBy) || sortBy == "null") sortBy = "id";
            if (string.IsNullOrWhiteSpace(sortDir) || sortDir.ToLower() == "null") sortDir = "asc";
            return unitOfWork.JournalApplicationRepository.GetPaginated(pageSize, pageNumber, sortBy, sortDir, journalsId);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.JournalApplicationRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
