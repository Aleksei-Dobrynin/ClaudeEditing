using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ServicePriceUseCase
    {
        private readonly IUnitOfWork unitOfWork;

        public ServicePriceUseCase(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<List<ServicePrice>> GetAll()
        {
            return await unitOfWork.ServicePriceRepository.GetAll();
        }
        
        public async Task<List<ServicePrice>> GetByStructure(int structure_id)
        {
            return await unitOfWork.ServicePriceRepository.GetByStructure(structure_id);
        }
        
        public async Task<List<ServicePrice>> GetByStructureAndService(int structure_id, int service_id)
        {
            return await unitOfWork.ServicePriceRepository.GetByStructureAndService(structure_id, service_id);
        } 
        
        public async Task<List<Service>> GetServiceAll()
        {
            return await unitOfWork.ServicePriceRepository.GetServiceAll();
        }
        
        public async Task<List<Service>> GetServiceAll(int service_id)
        {
            return await unitOfWork.ServicePriceRepository.GetServiceAll(service_id);
        }
        
        public async Task<List<Service>> GetServiceByStructure(int structure_id, int? service_id)
        {
            return await unitOfWork.ServicePriceRepository.GetServiceByStructure(structure_id, service_id);
        }

        public async Task<ServicePrice> GetOneByID(int id)
        {
            return await unitOfWork.ServicePriceRepository.GetOneById(id);
        }        
        
        public async Task<ServicePrice> GetByApplicationAndStructure(int applicationId, int structureId)
        {
            return await unitOfWork.ServicePriceRepository.GetByApplicationAndStructure(applicationId, structureId);
        }
        
        public async Task<int> Create(ServicePrice domain)
        {
            var result = await unitOfWork.ServicePriceRepository.Add(domain);
            unitOfWork.Commit();
            return result;
        }
        
        public async Task Update(ServicePrice domain)
        {
            await unitOfWork.ServicePriceRepository.Update(domain);
            unitOfWork.Commit();
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ServicePriceRepository.Delete(id);
            unitOfWork.Commit();
            return;
        }
    }
}
