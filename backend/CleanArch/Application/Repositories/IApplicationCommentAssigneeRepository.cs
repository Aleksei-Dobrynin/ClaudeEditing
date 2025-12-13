using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationCommentAssigneeRepository : BaseRepository
    {
        Task<List<ApplicationCommentAssignee>> GetAll();
        Task<ApplicationCommentAssignee> GetOneByID(int id);
        Task<int> Add(ApplicationCommentAssignee domain);
        Task Update(ApplicationCommentAssignee domain);
        Task Delete(int id);
        Task<ApplicationCommentAssignee> GetOneByCommentID(int id);
    }
}
