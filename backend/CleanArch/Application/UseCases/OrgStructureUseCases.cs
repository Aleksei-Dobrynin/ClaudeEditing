using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class OrgStructureUseCases
    {
        private readonly IAuthRepository _authRepository;
        private readonly IUnitOfWork unitOfWork;

        public OrgStructureUseCases(IUnitOfWork unitOfWork, IAuthRepository authRepository)
        {
            _authRepository = authRepository;
            this.unitOfWork = unitOfWork;
        }

        public Task<List<OrgStructure>> GetAll()
        {
            return unitOfWork.OrgStructureRepository.GetAll();
        }
        public async Task<List<OrgStructure>> GetAllMy()
        {
            var user = await _authRepository.GetCurrentUser();
            var roles = await _authRepository.GetMyRoles();
            if (roles.Contains("registrar") || roles.Contains("admin"))
            {
                return await unitOfWork.OrgStructureRepository.GetAll();
            }
            return await unitOfWork.OrgStructureRepository.GetByUserId(user.Id);
        }
        
        public Task<OrgStructure> GetOne(int id)
        {
            return unitOfWork.OrgStructureRepository.GetOne(id);
        }
        public async Task<OrgStructure> Create(OrgStructure domain)
        {
            var result = await unitOfWork.OrgStructureRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<OrgStructure> Update(OrgStructure domain)
        {
            await unitOfWork.OrgStructureRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<OrgStructure>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.OrgStructureRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.OrgStructureRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}
