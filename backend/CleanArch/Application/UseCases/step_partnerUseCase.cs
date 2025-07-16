using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class step_partnerUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public step_partnerUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<step_partner>> GetAll()
        {
            return unitOfWork.step_partnerRepository.GetAll();
        }
        public Task<step_partner> GetOne(int id)
        {
            return unitOfWork.step_partnerRepository.GetOne(id);
        }
        public async Task<step_partner> Create(step_partner domain)
        {
            var result = await unitOfWork.step_partnerRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<step_partner> Update(step_partner domain)
        {
            await unitOfWork.step_partnerRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<step_partner>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.step_partnerRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.step_partnerRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<step_partner>>  GetBystep_id(int step_id)
        {
            return unitOfWork.step_partnerRepository.GetBystep_id(step_id);
        }
        
        public Task<List<step_partner>>  GetBypartner_id(int partner_id)
        {
            return unitOfWork.step_partnerRepository.GetBypartner_id(partner_id);
        }
        
    }
}
