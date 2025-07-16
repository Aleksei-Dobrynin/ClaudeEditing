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
    }
}
