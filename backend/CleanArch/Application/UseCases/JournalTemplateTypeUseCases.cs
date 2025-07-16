using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class JournalTemplateTypeUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public JournalTemplateTypeUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<JournalTemplateType>> GetAll()
        {
            return unitOfWork.JournalTemplateTypeRepository.GetAll();
        }
        
        public Task<JournalTemplateType> GetOneByID(int id)
        {
            return unitOfWork.JournalTemplateTypeRepository.GetOneByID(id);
        }

        public async Task<JournalTemplateType> Create(JournalTemplateType domain)
        {
            var result = await unitOfWork.JournalTemplateTypeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<JournalTemplateType> Update(JournalTemplateType domain)
        {
            await unitOfWork.JournalTemplateTypeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<JournalTemplateType>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.JournalTemplateTypeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.JournalTemplateTypeRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
