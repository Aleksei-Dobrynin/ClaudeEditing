using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_QueriesDocumentTemplateUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_QueriesDocumentTemplateUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_QueriesDocumentTemplate>> GetAll()
        {
            return unitOfWork.S_QueriesDocumentTemplateRepository.GetAll();
        }
        public Task<S_QueriesDocumentTemplate> GetOne(int id)
        {
            return unitOfWork.S_QueriesDocumentTemplateRepository.GetOne(id);
        }
        public async Task<S_QueriesDocumentTemplate> Create(S_QueriesDocumentTemplate domain)
        {
            var result = await unitOfWork.S_QueriesDocumentTemplateRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_QueriesDocumentTemplate> Update(S_QueriesDocumentTemplate domain)
        {
            await unitOfWork.S_QueriesDocumentTemplateRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_QueriesDocumentTemplate>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_QueriesDocumentTemplateRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_QueriesDocumentTemplateRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<S_QueriesDocumentTemplate>>  GetByidDocumentTemplate(int idDocumentTemplate)
        {
            return unitOfWork.S_QueriesDocumentTemplateRepository.GetByidDocumentTemplate(idDocumentTemplate);
        }
        
        public Task<List<S_QueriesDocumentTemplate>>  GetByidQuery(int idQuery)
        {
            return unitOfWork.S_QueriesDocumentTemplateRepository.GetByidQuery(idQuery);
        }
        
    }
}
