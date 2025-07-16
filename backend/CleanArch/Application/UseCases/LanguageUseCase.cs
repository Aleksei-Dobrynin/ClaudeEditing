using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class LanguageUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public LanguageUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Language>> GetAll()
        {
            return unitOfWork.LanguageRepository.GetAll();
        }
        public Task<Language> GetOne(int id)
        {
            return unitOfWork.LanguageRepository.GetOne(id);
        }
        public async Task<Language> Create(Language domain)
        {
            var result = await unitOfWork.LanguageRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Language> Update(Language domain)
        {
            await unitOfWork.LanguageRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Language>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.LanguageRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.LanguageRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
