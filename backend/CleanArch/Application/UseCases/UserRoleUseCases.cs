using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class UserRoleUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public UserRoleUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<UserRole>> GetAll()
        {
            return unitOfWork.UserRoleRepository.GetAll();
        }
        
        public Task<UserRole> GetOneByID(int id)
        {
            return unitOfWork.UserRoleRepository.GetOneByID(id);
        }

        public async Task<UserRole> Create(UserRole domain)
        {
            var result = await unitOfWork.UserRoleRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<UserRole> Update(UserRole domain)
        {
            await unitOfWork.UserRoleRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<UserRole>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.UserRoleRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.UserRoleRepository.Delete(id);
            unitOfWork.Commit();
        }

        public async Task<int> GetCurentUserId()
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            return user_id;
        }
    }
}
