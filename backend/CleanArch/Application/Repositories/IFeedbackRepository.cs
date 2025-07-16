using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IFeedbackRepository : BaseRepository
    {
        Task<int> Add(Feedback domain);
    }
}
