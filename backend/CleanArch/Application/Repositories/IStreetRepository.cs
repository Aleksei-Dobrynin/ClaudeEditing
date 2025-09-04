using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IStreetRepository : BaseRepository
    {
        Task<List<Street>> GetAll();
        Task<List<Street>> Search(string text, int ateId);
        Task<List<Street>> GetAteStreets(int ateId);
        Task<Street> GetOneByID(int id);
        Task<PaginatedList<Street>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Street domain);
        Task Update(Street domain);
        Task Delete(int id);
    }
}