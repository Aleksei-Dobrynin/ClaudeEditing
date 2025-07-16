using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_paymentRepository : BaseRepository
    {
        Task<List<application_payment>> GetAll();
        Task<PaginatedList<application_payment>> GetPaginated(int pageSize, int pageNumber);
        Task<PaginatedList<applacation_payment_sum>> GetPagniatedByParam(DateTime dateStart, DateTime dateEnd, List<int> structiure_ids);
        Task<int> Add(application_payment domain);
        Task Update(application_payment domain);
        Task<application_payment> GetOne(int id);
        Task Delete(int id);
        
        
        Task<List<application_payment>> GetByapplication_id(int application_id);
        Task<List<DashboardGetEmployeeCalculationsDto>> DashboardGetEmployeeCalculations(int structure_id, DateTime date_start, DateTime date_end, string sort);
        Task<List<DashboardGetEmployeeCalculationsGroupedDto>> DashboardGetEmployeeCalculationsGrouped(int structure_id, DateTime date_start, DateTime date_end);
        Task<List<application_payment>> GetByApplicationIds(List<int> ids);
        Task<List<application_payment>> GetBystructure_id(int structure_id);
    }
}
