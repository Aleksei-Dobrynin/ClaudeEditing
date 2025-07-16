using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class application_pauseUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_pauseUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<application_pause>> GetAll()
        {
            return unitOfWork.application_pauseRepository.GetAll();
        }
        public Task<application_pause> GetOne(int id)
        {
            return unitOfWork.application_pauseRepository.GetOne(id);
        }
        public async Task<application_pause> Create(application_pause domain)
        {
            var result = await unitOfWork.application_pauseRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_pause> Update(application_pause domain)
        {
            await unitOfWork.application_pauseRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_pause>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_pauseRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_pauseRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<application_pause>>  GetByapplication_id(int application_id)
        {
            return unitOfWork.application_pauseRepository.GetByapplication_id(application_id);
        }
        
        public Task<List<application_pause>>  GetByapp_step_id(int app_step_id)
        {
            return unitOfWork.application_pauseRepository.GetByapp_step_id(app_step_id);
        }
        
    }
}
