using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class contragentUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public contragentUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<contragent>> GetAll()
        {
            return unitOfWork.contragentRepository.GetAll();
        }

        public Task<contragent> GetOne(int id)
        {
            return unitOfWork.contragentRepository.GetOne(id);
        }

        public Task<contragent> GetOneByCode(string code)
        {
            return unitOfWork.contragentRepository.GetOneByCode(code);
        }

        public async Task<contragent> Create(contragent domain)
        {
            var result = await unitOfWork.contragentRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<contragent> Update(contragent domain)
        {
            await unitOfWork.contragentRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<contragent>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.contragentRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.contragentRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }
    }
}