using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class contragent_interactionUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public contragent_interactionUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<contragent_interaction>> GetAll()
        {
            return unitOfWork.contragent_interactionRepository.GetAll();
        }
        public Task<contragent_interaction> GetOne(int id)
        {
            return unitOfWork.contragent_interactionRepository.GetOne(id);
        }
        public async Task<contragent_interaction> Create(contragent_interaction domain)
        {
            //TODO demo
            if (string.IsNullOrWhiteSpace(domain.status))
            {
                domain.status = "В работе";
            }
            var result = await unitOfWork.contragent_interactionRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<contragent_interaction> Update(contragent_interaction domain)
        {
            await unitOfWork.contragent_interactionRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<contragent_interaction>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.contragent_interactionRepository.GetPaginated(pageSize, pageNumber);
        }
        public Task<List<contragent_interaction>> GetFilter(string pin, string address, string number, DateTime? date_start, DateTime? date_end)
        {
            return unitOfWork.contragent_interactionRepository.GetFilter(pin, address, number, date_start, date_end);
        }
        
        public async Task<int> Delete(int id)
        {
            await unitOfWork.contragent_interactionRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<contragent_interaction>>  GetByapplication_id(int application_id)
        {
            return unitOfWork.contragent_interactionRepository.GetByapplication_id(application_id);
        }
        
        public Task<List<contragent_interaction>>  GetBytask_id(int task_id)
        {
            return unitOfWork.contragent_interactionRepository.GetBytask_id(task_id);
        }
        
        public Task<List<contragent_interaction>>  GetBycontragent_id(int contragent_id)
        {
            return unitOfWork.contragent_interactionRepository.GetBycontragent_id(contragent_id);
        }
        
    }
}
