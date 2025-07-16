using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class organization_typeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public organization_typeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<organization_type>> GetAll()
        {
            return unitOfWork.organization_typeRepository.GetAll();
        }
        public Task<organization_type> GetOne(int id)
        {
            return unitOfWork.organization_typeRepository.GetOne(id);
        }
        public async Task<organization_type> Create(organization_type domain)
        {
            var result = await unitOfWork.organization_typeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<organization_type> Update(organization_type domain)
        {
            await unitOfWork.organization_typeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<organization_type>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.organization_typeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.organization_typeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
