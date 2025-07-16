using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class identity_document_typeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public identity_document_typeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<identity_document_type>> GetAll()
        {
            return unitOfWork.identity_document_typeRepository.GetAll();
        }
        public Task<identity_document_type> GetOne(int id)
        {
            return unitOfWork.identity_document_typeRepository.GetOne(id);
        }
        public async Task<identity_document_type> Create(identity_document_type domain)
        {
            var result = await unitOfWork.identity_document_typeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<identity_document_type> Update(identity_document_type domain)
        {
            await unitOfWork.identity_document_typeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<identity_document_type>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.identity_document_typeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.identity_document_typeRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
