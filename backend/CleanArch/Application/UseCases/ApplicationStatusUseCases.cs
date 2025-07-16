using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ApplicationStatusUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ApplicationStatusUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Domain.Entities.ApplicationStatus>> GetAll()
        {
            return unitOfWork.ApplicationStatusRepository.GetAll();
        }
    }
}
