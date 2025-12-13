
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface Iapplication_commentRepository : BaseRepository
    {
        Task<List<Domain.Entities.application_comment>> GetAll();
        Task<Domain.Entities.application_comment> GetOne(int id);
        //Task<PaginatedList<Domain.Entities.application_comment>> GetPaginated(int pageSize, int pageNumber, string sort_by, string sort_type, string search_text, DateTime? date_start, DateTime? date_end, int[] service_ids, string address, int? district_id);
        Task<int> Add(Domain.Entities.application_comment domain);
        Task Update(Domain.Entities.application_comment domain);
        Task Delete(int id);
        Task<List<Domain.Entities.application_comment>> GetByapplication_id(int id);
        Task<int> GetUserByEmail(string email);
        Task<List<Domain.Entities.application_comment>> MyAssigned(int id);
    }
}
