using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class RoleUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public RoleUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Role>> GetAll()
        {
            return unitOfWork.RoleRepository.GetAll();
        }
        
        public Task<Role> GetOneByID(int id)
        {
            return unitOfWork.RoleRepository.GetOneByID(id);
        }

        public async Task<Role> Create(Role domain)
        {
            var result = await unitOfWork.RoleRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Role> Update(Role domain)
        {
            await unitOfWork.RoleRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Role>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.RoleRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.RoleRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
