using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class S_PlaceHolderTemplateUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public S_PlaceHolderTemplateUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<S_PlaceHolderTemplate>> GetAll()
        {
            return unitOfWork.S_PlaceHolderTemplateRepository.GetAll();
        }
        public Task<S_PlaceHolderTemplate> GetOne(int id)
        {
            return unitOfWork.S_PlaceHolderTemplateRepository.GetOne(id);
        }
        public async Task<S_PlaceHolderTemplate> Create(S_PlaceHolderTemplate domain)
        {
            var result = await unitOfWork.S_PlaceHolderTemplateRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<S_PlaceHolderTemplate> Update(S_PlaceHolderTemplate domain)
        {
            await unitOfWork.S_PlaceHolderTemplateRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<S_PlaceHolderTemplate>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.S_PlaceHolderTemplateRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.S_PlaceHolderTemplateRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }



        public Task<List<S_PlaceHolderTemplate>> GetByidQuery(int idQuery)
        {
            return unitOfWork.S_PlaceHolderTemplateRepository.GetByidQuery(idQuery);
        }

        public Task<List<S_PlaceHolderTemplate>> GetByidPlaceholderType(int idPlaceholderType)
        {
            return unitOfWork.S_PlaceHolderTemplateRepository.GetByidPlaceholderType(idPlaceholderType);
        }

    }
}
