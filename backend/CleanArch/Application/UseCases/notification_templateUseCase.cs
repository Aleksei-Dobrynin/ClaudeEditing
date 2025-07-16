using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class notification_templateUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public notification_templateUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<notification_template>> GetAll()
        {
            return unitOfWork.notification_templateRepository.GetAll();
        }
        public Task<notification_template> GetOne(int id)
        {
            return unitOfWork.notification_templateRepository.GetOne(id);
        }
        public async Task<notification_template> Create(notification_template domain)
        {
            var result = await unitOfWork.notification_templateRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<notification_template> Update(notification_template domain)
        {
            await unitOfWork.notification_templateRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<notification_template>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.notification_templateRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.notification_templateRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<notification_template>>  GetBycontact_type_id(int contact_type_id)
        {
            return unitOfWork.notification_templateRepository.GetBycontact_type_id(contact_type_id);
        }
        
    }
}
