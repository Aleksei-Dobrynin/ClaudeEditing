// Создайте этот файл в вашем тестовом проекте
using Application.Repositories;
using Domain.Entities;
using System.Threading.Tasks;

namespace WebApi.IntegrationTests.Mocks
{
    public class TestAuthRepository : IAuthRepository
    {
        public Task<AuthToken> Login(string username, string password)
        {
            throw new NotImplementedException();
        }

        public Task<UserInfo> GetUserInfo()
        {
            var userInfo = new UserInfo
            {
                Email = "test.user@example.com",
                UserName = "test.user",
                Id = "1"
            };

            return Task.FromResult(userInfo);
        }

        public Task<int> GetUserID()
        {
            return Task.FromResult(1);
        }

        public Task<string> GetUserUID()
        {
            return Task.FromResult("test-user-id");
        }

        public Task<UserInfo> ChangePassword(string currentPassword, string newPassword)
        {
            throw new NotImplementedException();
        }

        public Task<UserInfo> GetCurrentUser()
        {
            var userInfo = new UserInfo
            {
                Email = "test.user@example.com",
                UserName = "test.user",
                Id = "1"
            };
            return Task.FromResult(userInfo);
        }

        public Task<bool> IsSuperAdmin(string username)
        {
            throw new NotImplementedException();
        }

        public Task<List<string>> GetMyRoles()
        {
            return Task.FromResult(new List<string> { "registrar" });
        }

        public Task<UserInfo> GetByUserId(string userId)
        {
            var userInfo = new UserInfo
            {
                Email = "email@mock.com",
                UserName = "mock.user",
                Id = "0"
            };

            return Task.FromResult(userInfo);
        }

        public Task<bool> ForgotPassword(string email)
        {
            throw new NotImplementedException();
        }

        public Task<string> Create(string username, string password)
        {
            return Task.FromResult("test-user-id"); // Mocked user ID
            //throw new NotImplementedException();
        }

        public async Task<AuthResult> Authenticate(string username, string password)
        {
            return new AuthResult
            {
                Success = true,
                Token = "", //TODO?
                UserId = "", //TODO?
                Message = "Login successful"
            };
        }

        public Task<List<int>> GetMyRoleIds()
        {
            throw new NotImplementedException();
        }
    }
}