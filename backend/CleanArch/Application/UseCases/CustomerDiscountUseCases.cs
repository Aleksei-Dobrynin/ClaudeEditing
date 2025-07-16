using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CustomerDiscountUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomerDiscountUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<CustomerDiscount>> GetAll()
        {
            return unitOfWork.CustomerDiscountRepository.GetAll();
        }
        
        public Task<CustomerDiscount> GetOneByID(int id)
        {
            return unitOfWork.CustomerDiscountRepository.GetOneByID(id);
        }
        
        public async Task<CustomerDiscount> GetOneByIdApplication(int idApplication)
        {
            var application = await unitOfWork.ApplicationRepository.GetOneByID(idApplication);
            var customerDiscount = await unitOfWork.CustomerDiscountRepository.GetOneByPin(application.customer_pin);
            if (customerDiscount == null)
            {
                return new CustomerDiscount
                {
                    id = 0,
                    pin_customer = "",
                    active_discount_count = 0,
                };
            }
            return customerDiscount;
        }

        public async Task<CustomerDiscount> Create(CustomerDiscount domain)
        {
            var result = await unitOfWork.CustomerDiscountRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<CustomerDiscount> Update(CustomerDiscount domain)
        {
            await unitOfWork.CustomerDiscountRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<CustomerDiscount>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.CustomerDiscountRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.CustomerDiscountRepository.Delete(id);
            unitOfWork.Commit();
        }
    }
}
