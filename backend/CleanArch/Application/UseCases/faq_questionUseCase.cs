using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class faq_questionUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public faq_questionUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<faq_question>> GetAll()
        {
            return unitOfWork.faq_questionRepository.GetAll();
        }
        public Task<faq_question> GetOne(int id)
        {
            return unitOfWork.faq_questionRepository.GetOne(id);
        }
        public async Task<faq_question> Create(faq_question domain)
        {
            var result = await unitOfWork.faq_questionRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<faq_question> Update(faq_question domain)
        {
            await unitOfWork.faq_questionRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<faq_question>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.faq_questionRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.faq_questionRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
    }
}
