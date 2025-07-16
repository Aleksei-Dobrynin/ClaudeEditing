using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_in_reestrRepository : BaseRepository
    {
        Task<List<application_in_reestr>> GetAll();
        Task<PaginatedList<application_in_reestr>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_in_reestr domain);
        Task Update(application_in_reestr domain);
        Task<application_in_reestr> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_in_reestr>> GetByApplicationIds(int[] ids);
        Task<List<application_in_reestr>> GetByreestr_id(int reestr_id);
        Task<List<application_in_reestr>> GetByAppId(int application_id);
        Task<List<ReestrOtchetApplicationData>> GetByreestr_idWithApplication(int reestr_id);
        Task<List<ReestrOtchetApplicationData>> GetSvodnaya(int year, int month, string status);
        Task<List<TaxOtchetData>> GetTaxReport(int year, int month, string status);
    }
}
