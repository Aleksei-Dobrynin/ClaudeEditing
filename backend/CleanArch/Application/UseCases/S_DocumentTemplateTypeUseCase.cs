using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_DocumentTemplateTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_DocumentTemplateTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_DocumentTemplateType>> GetAll()
        {
            return unitOfWork.S_DocumentTemplateTypeRepository.GetAll();
        }
        public Task<S_DocumentTemplateType> GetOne(int id)
        {
            return unitOfWork.S_DocumentTemplateTypeRepository.GetOne(id);
        }
        public async Task<S_DocumentTemplateType> Create(S_DocumentTemplateType domain)
        {
            var result = await unitOfWork.S_DocumentTemplateTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_DocumentTemplateType> Update(S_DocumentTemplateType domain)
        {
            await unitOfWork.S_DocumentTemplateTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_DocumentTemplateType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_DocumentTemplateTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_DocumentTemplateTypeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
