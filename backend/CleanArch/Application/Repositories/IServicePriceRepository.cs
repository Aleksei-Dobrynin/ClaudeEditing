using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IServicePriceRepository : BaseRepository
    {
        Task<ServicePrice> GetByApplicationAndStructure(int applicationId, int structureId);
        Task<List<ServicePrice>> GetAll();
        Task<ServicePrice> GetOneById(int id);
        Task<int> Add(ServicePrice domain);
        Task Update(ServicePrice domain);
        Task Delete(int id);
        Task<List<Service>> GetServiceAll();
        Task<List<Service>> GetServiceAll(int service_id);
        Task<List<Service>> GetServiceByStructure(int structure_id, int? service_id);
        Task<List<ServicePrice>> GetByStructure(int structure_id);
        Task<List<ServicePrice>> GetByStructureAndService(int structure_id, int service_id);
    }
}
