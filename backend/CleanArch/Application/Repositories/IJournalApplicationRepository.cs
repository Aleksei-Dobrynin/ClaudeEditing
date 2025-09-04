using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IJournalApplicationRepository : BaseRepository
    {
        Task<List<JournalApplication>> GetAll();
        Task<JournalApplication> GetOneByID(int id);
        Task<PaginatedList<JournalApplication>> GetPaginated(int pageSize, int pageNumber, string sortBy, string sortDir, int journalsId);
        Task<int> Add(JournalApplication domain);
        Task Update(JournalApplication domain);
        Task Delete(int id);
        Task<List<JournalApplication>> GetByAppID(List<int> appIds);
    }
}