using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface 
        IUserRepository : BaseRepository
    {
        Task<User> GetOneByID(int id);
        Task<int> Add(User domain);
        Task<int> GetUserID();
        Task<UserInfo> GetUserInfo();
        Task<string> GetUserUID();
        Task<User> GetByEmail(string email);
        Task<bool> UpdateLastLogin(int userId);
    }
}
