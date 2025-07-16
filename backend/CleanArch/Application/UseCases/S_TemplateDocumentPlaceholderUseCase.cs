using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_TemplateDocumentPlaceholderUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_TemplateDocumentPlaceholderUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_TemplateDocumentPlaceholder>> GetAll()
        {
            return unitOfWork.S_TemplateDocumentPlaceholderRepository.GetAll();
        }
        public Task<S_TemplateDocumentPlaceholder> GetOne(int id)
        {
            return unitOfWork.S_TemplateDocumentPlaceholderRepository.GetOne(id);
        }
        public async Task<S_TemplateDocumentPlaceholder> Create(S_TemplateDocumentPlaceholder domain)
        {
            var result = await unitOfWork.S_TemplateDocumentPlaceholderRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_TemplateDocumentPlaceholder> Update(S_TemplateDocumentPlaceholder domain)
        {
            await unitOfWork.S_TemplateDocumentPlaceholderRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_TemplateDocumentPlaceholder>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_TemplateDocumentPlaceholderRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_TemplateDocumentPlaceholderRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<S_TemplateDocumentPlaceholder>>  GetByidTemplateDocument(int idTemplateDocument)
        {
            return unitOfWork.S_TemplateDocumentPlaceholderRepository.GetByidTemplateDocument(idTemplateDocument);
        }
        
        public Task<List<S_TemplateDocumentPlaceholder>>  GetByidPlaceholder(int idPlaceholder)
        {
            return unitOfWork.S_TemplateDocumentPlaceholderRepository.GetByidPlaceholder(idPlaceholder);
        }
        
    }
}
