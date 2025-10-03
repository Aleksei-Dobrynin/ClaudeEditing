using Application.Models;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IcontragentRepository : BaseRepository
    {
        Task<List<contragent>> GetAll();
        Task<PaginatedList<contragent>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(contragent domain);
        Task Update(contragent domain);
        Task<contragent> GetOne(int id);
        Task<contragent> GetOneByCode(string code);
        Task Delete(int id);
    }
}