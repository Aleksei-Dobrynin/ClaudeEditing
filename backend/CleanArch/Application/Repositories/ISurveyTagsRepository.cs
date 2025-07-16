using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ISurveyTagsRepository: BaseRepository
    {
        Task<List<SurveyTags>> GetAll();
        Task<PaginatedList<SurveyTags>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(SurveyTags domain);
        Task Update(SurveyTags domain);
    }
}
