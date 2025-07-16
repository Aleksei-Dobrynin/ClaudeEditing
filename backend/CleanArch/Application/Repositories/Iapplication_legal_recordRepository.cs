using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_legal_recordRepository : BaseRepository
    {
        Task<List<application_legal_record>> GetAll();
        Task<PaginatedList<application_legal_record>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_legal_record domain);
        Task Update(application_legal_record domain);
        Task<application_legal_record> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_legal_record>> GetByid_application(int id_application);
        Task<List<application_legal_record>> GetByid_legalrecord(int id_legalrecord);
        Task<List<application_legal_record>> GetByid_legalact(int id_legalact);
    }
}
