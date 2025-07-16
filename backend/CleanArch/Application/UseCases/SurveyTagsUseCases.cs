using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class SurveyTagsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public SurveyTagsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<SurveyTags>> GetAll()
        {
            return unitOfWork.SurveyTagsRepository.GetAll();
        }

        public async Task<SurveyTags> Create(SurveyTags domain)
        {
            var result = await unitOfWork.SurveyTagsRepository.Add(domain);
            domain.id = result;
            return domain;
        }

        public async Task<SurveyTags> Update(SurveyTags domain)
        {
            await unitOfWork.SurveyTagsRepository.Update(domain);
            return domain;
        }

        public Task<PaginatedList<SurveyTags>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.SurveyTagsRepository.GetPaginated(pageSize, pageNumber);
        }
    }
}
