using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class customer_contactUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public customer_contactUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<customer_contact>> GetAll()
        {
            return unitOfWork.customer_contactRepository.GetAll();
        }
        public Task<customer_contact> GetOne(int id)
        {
            return unitOfWork.customer_contactRepository.GetOne(id);
        }
        public async Task<customer_contact> Create(customer_contact domain)
        {
            var result = await unitOfWork.customer_contactRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<customer_contact> Update(customer_contact domain)
        {
            await unitOfWork.customer_contactRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<customer_contact>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.customer_contactRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.customer_contactRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<customer_contact>>  GetBytype_id(int type_id)
        {
            return unitOfWork.customer_contactRepository.GetBytype_id(type_id);
        }
        
        public Task<List<customer_contact>>  GetBycustomer_id(int customer_id)
        {
            return unitOfWork.customer_contactRepository.GetBycustomer_id(customer_id);
        }
        public Task<List<customer_contact>> GetByNumber(string value)
        {
            return unitOfWork.customer_contactRepository.GetByNumber(value);
        }
    }
}
