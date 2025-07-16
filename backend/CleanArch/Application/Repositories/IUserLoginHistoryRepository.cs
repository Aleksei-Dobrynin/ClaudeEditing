using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IUserLoginHistoryRepository : BaseRepository
    {
        Task<int> SaveLoginUserData(string userId, string ipAddress, string device, string browser, string os);
        Task<List<UserLoginHistory>> GetRecentByUserId(string userId, int limit = 10);
        Task<int> Add(UserLoginHistory domain);
    }
}