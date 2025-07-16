using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationPaidInvoiceRepository : BaseRepository
    {
        Task<List<ApplicationPaidInvoice>> GetAll();
        Task<ApplicationPaidInvoice> GetOneByID(int id);
        Task<List<ApplicationPaidInvoice>> GetByIDApplication(int idApplication);
        Task<List<ApplicationPaidInvoice>> GetOneByApplicationIds(List<int> ids);
        Task<PaginatedList<ApplicationPaidInvoice>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ApplicationPaidInvoice domain);
        Task Update(ApplicationPaidInvoice domain);
        Task Delete(int id);
        Task<List<ApplicationPaidInvoice>> GetApplicationWithTaxAndDateRange( DateTime startDate, DateTime endDate);
        Task<List<ApplicationPaidInvoice>> GetByApplicationGuid(string guid);
        Task<List<PaidInvoiceInfo>> GetPaidInvoices(DateTime dateStart, DateTime dateEnd, string? number, int[]? structures_ids);
    }
}
