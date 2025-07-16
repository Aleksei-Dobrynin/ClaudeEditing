using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IArchiveObjectCustomerRepository : BaseRepository
    {
        Task<List<ArchiveObjectCustomer>> GetAll();
        Task<PaginatedList<ArchiveObjectCustomer>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(ArchiveObjectCustomer domain);
        Task Update(ArchiveObjectCustomer domain);
        Task<ArchiveObjectCustomer> GetOne(int id);
        Task Delete(int id);
        Task<List<ArchiveObjectCustomer>> GetByArchiveObjectId(int archiveObjectId);
    }
}
