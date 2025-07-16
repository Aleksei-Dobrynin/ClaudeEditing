using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface Icustomers_for_archive_objectRepository : BaseRepository
    {
        Task<List<customers_for_archive_object>> GetAll();        
        Task<List<customers_objects>> GetCustomersForArchiveObjects();
        Task<PaginatedList<customers_for_archive_object>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(customers_for_archive_object domain);
        Task<List<customers_for_archive_object>> GetByCustomersIdArchiveObject(int ArchiveObject_id);
        Task Update(customers_for_archive_object domain);
        Task<customers_for_archive_object> GetOne(int id);
        Task Delete(int id);
    }
}
