using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IFeedbackFilesRepository : BaseRepository
    {
        Task<int> Add(FeedbackFiles domain);
    }
}
