using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationStatusHistoryUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationStatusHistoryUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Domain.Entities.ApplicationStatusHistory>> GetAll()
        {
            return unitOfWork.ApplicationStatusHistoryRepository.GetAll();
        }

        public Task<List<Domain.Entities.ApplicationStatusHistory>> GetByApplicationId (int application_id)
        {
            return unitOfWork.ApplicationStatusHistoryRepository.GetByApplicationID(application_id);
        }
    }
}
