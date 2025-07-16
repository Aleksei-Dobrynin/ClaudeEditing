using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationStatusRepository : BaseRepository
    {
        Task<List<Domain.Entities.ApplicationStatus>> GetAll();
        Task<ApplicationStatus> GetByCode(string code);

        Task<Domain.Entities.ApplicationStatus> GetById(int id);
    }
}
