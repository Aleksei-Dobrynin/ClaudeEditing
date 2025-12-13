using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface ICommentTypeRepository : BaseRepository
    {
        Task<List<CommentType>> GetAll();
        Task<CommentType> GetOneByID(int id);
        Task<int> Add(CommentType domain);
        Task Update(CommentType domain);
        Task Delete(int id);
    }
}
