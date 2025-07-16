using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IS_PlaceHolderTemplateRepository : BaseRepository
    {
        Task<List<S_PlaceHolderTemplate>> GetAll();
        Task<PaginatedList<S_PlaceHolderTemplate>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(S_PlaceHolderTemplate domain);
        Task Update(S_PlaceHolderTemplate domain);
        Task<S_PlaceHolderTemplate> GetOne(int id);
        Task Delete(int id);

        Task<List<S_PlaceHolderTemplate>> GetByNames(List<string> placeholderNames);


        Task<List<S_PlaceHolderTemplate>> GetByidQuery(int idQuery);
        Task<List<S_PlaceHolderTemplate>> GetByidPlaceholderType(int idPlaceholderType);
    }
}
