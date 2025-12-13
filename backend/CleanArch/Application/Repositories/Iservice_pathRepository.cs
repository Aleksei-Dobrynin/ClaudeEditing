using Application.Models;
using Domain.Entities;
using Infrastructure.Data.Models;

namespace Application.Repositories
{
    public interface Iservice_pathRepository : BaseRepository
    {
        Task<List<service_path>> GetAll();
        Task<PaginatedList<service_path>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(service_path domain);
        Task Update(service_path domain);
        Task<service_path> GetOne(int id);
        Task Delete(int id);
        Task<ServiceWithPathAndSignersModel?> GetServiceWithPathAndSigners(int serviceId);
        Task<List<ServiceWithPathAndSignersModel>> GetAllServicesWithPathsAndSigners();
        Task<List<service_path>> GetByservice_id(int service_id);
    }
}
