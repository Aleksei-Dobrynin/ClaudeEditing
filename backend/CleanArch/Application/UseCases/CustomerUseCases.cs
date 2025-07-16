using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class CustomerUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CustomerUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Customer>> GetAll()
        {
            return unitOfWork.CustomerRepository.GetAll();
        }
        public Task<List<Customer>> GetAllBySearch(string text)
        {
            return unitOfWork.CustomerRepository.GetAllBySearch(text);
        }
        
        public async Task<Customer> GetOneByID(int id)
        {
            var reprs = await unitOfWork.CustomerRepresentativeRepository.GetByidCustomer(id);
            var res = await unitOfWork.CustomerRepository.GetOneByID(id);
            res.customerRepresentatives = reprs;

            var contacts = await unitOfWork.customer_contactRepository.GetBycustomer_id(id);
            var smss = contacts.Where(x => x.type_code == "sms").ToList();
            var emails = contacts.Where(x => x.type_code == "email").ToList();
            var telegrams = contacts.Where(x => x.type_code == "telegram").ToList();
            if (smss.Count > 0)
            {
                res.sms_1 = smss[0]?.value;
            }
            if (smss.Count > 1)
            {
                res.sms_2 = smss[1]?.value;
            }
            if (emails.Count > 0)
            {
                res.email_1 = emails[0]?.value;
            }
            if (emails.Count > 1)
            {
                res.email_2 = emails[1]?.value;
            }
            if (telegrams.Count > 0)
            {
                res.telegram_1 = telegrams[0]?.value;
            }
            if (telegrams.Count > 1)
            {
                res.telegram_2 = telegrams[1]?.value;
            }



            return res;
        }

        public async Task<Customer> Create(Customer domain)
        {
            var result = await unitOfWork.CustomerRepository.Add(domain);
            var smsType = await unitOfWork.contact_typeRepository.GetOneByCode("sms");
            var emailType = await unitOfWork.contact_typeRepository.GetOneByCode("email");
            var telegramType = await unitOfWork.contact_typeRepository.GetOneByCode("telegram");
            
            await AddCustomerContactIfNotNull(domain.sms_1, result, smsType.id);
            await AddCustomerContactIfNotNull(domain.sms_2, result, smsType.id);
            await AddCustomerContactIfNotNull(domain.email_1, result, emailType.id);
            await AddCustomerContactIfNotNull(domain.email_2, result, emailType.id);
            await AddCustomerContactIfNotNull(domain.telegram_1, result, telegramType.id);
            await AddCustomerContactIfNotNull(domain.telegram_2, result, telegramType.id);

            foreach (var customerRepresentative in domain.customerRepresentatives)
            {
                customerRepresentative.customer_id = result;
                await unitOfWork.CustomerRepresentativeRepository.Add(customerRepresentative);
            }
            
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }
        
        async Task AddCustomerContactIfNotNull(string? value, int customerId, int typeId)
        {
            if (!string.IsNullOrEmpty(value))
            {
                await unitOfWork.customer_contactRepository.Add(new customer_contact
                {
                    customer_id = customerId,
                    type_id = typeId,
                    value = value
                });
            }
        }

        public async Task<Customer> Update(Customer domain)
        {
            await unitOfWork.CustomerRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Customer>> GetPagniated(int pageSize, int pageNumber, string? orderBy, string? orderType)
        {
            if (pageSize < 1) pageSize = 1;
            return unitOfWork.CustomerRepository.GetPaginated(pageSize, pageNumber, orderBy, orderType);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.CustomerRepository.Delete(id);
            unitOfWork.Commit();
        }

        public async Task<Customer> GetOneByPin(string pin, int customer_id)
        {
            return await unitOfWork.CustomerRepository.GetOneByPin(pin, customer_id);
        }
    }
}
