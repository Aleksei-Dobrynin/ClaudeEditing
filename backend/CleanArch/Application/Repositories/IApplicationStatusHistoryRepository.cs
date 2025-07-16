using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationStatusHistoryRepository : BaseRepository
    {
        Task<List<Domain.Entities.ApplicationStatusHistory>> GetAll();

        Task<Domain.Entities.ApplicationStatusHistory> GetById(int id);
        Task<List<Domain.Entities.ApplicationStatusHistory>> GetByStatusId(int idStatus);
        Task<List<Domain.Entities.ApplicationStatusHistory>> GetByUserID(int idUser);
        Task<List<Domain.Entities.ApplicationStatusHistory>> GetByApplicationID(int idApplication);
        Task<int> Add(ApplicationStatusHistory domain);
        Task Update(ApplicationStatusHistory domain);
    }
}
