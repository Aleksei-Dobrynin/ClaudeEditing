using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ICustomSvgIconRepository: BaseRepository
    {
        Task<List<CustomSvgIcon>> GetAll();
        Task<PaginatedList<CustomSvgIcon>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(CustomSvgIcon domain);
        Task Update(CustomSvgIcon domain);
    }
}
