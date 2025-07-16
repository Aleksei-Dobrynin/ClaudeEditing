using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ServiceStatusNumberingUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ServiceStatusNumberingUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ServiceStatusNumbering>> GetAll()
        {
            return unitOfWork.ServiceStatusNumberingRepository.GetAll();
        } 
        
        public Task<List<ServiceStatusNumbering>> GetByServiceId(int id)
        {
            return unitOfWork.ServiceStatusNumberingRepository.GetByServiceId(id);
        }     
        
        public Task<List<ServiceStatusNumbering>> GetByJournalId(int id)
        {
            return unitOfWork.ServiceStatusNumberingRepository.GetByJournalId(id);
        }
        
        public Task<ServiceStatusNumbering> GetOneByID(int id)
        {
            return unitOfWork.ServiceStatusNumberingRepository.GetOneByID(id);
        }

        public async Task<ServiceStatusNumbering> Create(ServiceStatusNumbering domain)
        {
            var result = await unitOfWork.ServiceStatusNumberingRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<ServiceStatusNumbering> Update(ServiceStatusNumbering domain)
        {
            await unitOfWork.ServiceStatusNumberingRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<ServiceStatusNumbering>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ServiceStatusNumberingRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ServiceStatusNumberingRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
