using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CustomerDiscountDocumentsUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomerDiscountDocumentsUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<CustomerDiscountDocuments>> GetAll()
        {
            return unitOfWork.CustomerDiscountDocumentsRepository.GetAll();
        } 
        
        public Task<List<CustomerDiscountDocuments>> GetByIdCustomer(int idCustomer)
        {
            return unitOfWork.CustomerDiscountDocumentsRepository.GetByIdCustomer(idCustomer);
        }
        
        public Task<CustomerDiscountDocuments> GetOneByID(int id)
        {
            return unitOfWork.CustomerDiscountDocumentsRepository.GetOneByID(id);
        }

        public async Task<CustomerDiscountDocuments> Create(CustomerDiscountDocuments domain)
        {
            var result = await unitOfWork.CustomerDiscountDocumentsRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<CustomerDiscountDocuments> Update(CustomerDiscountDocuments domain)
        {
            await unitOfWork.CustomerDiscountDocumentsRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<CustomerDiscountDocuments>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.CustomerDiscountDocumentsRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.CustomerDiscountDocumentsRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
