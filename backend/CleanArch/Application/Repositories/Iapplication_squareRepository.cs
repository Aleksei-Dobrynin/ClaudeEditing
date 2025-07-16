using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_squareRepository : BaseRepository
    {
        Task<List<application_square>> GetAll();
        Task<PaginatedList<application_square>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_square domain);
        Task Update(application_square domain);
        Task<application_square> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_square>> GetByapplication_id(int application_id);
        Task<List<application_square>> GetBystructure_id(int structure_id);
        Task<List<application_square>> GetByunit_type_id(int unit_type_id);
    }
}
