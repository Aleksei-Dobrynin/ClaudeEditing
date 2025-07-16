using Domain.Entities;

namespace Application.Repositories
{
    public interface IMinjustRepository
    {
        Task<Customer> GetInfoByPin(string pin);
    }
}

