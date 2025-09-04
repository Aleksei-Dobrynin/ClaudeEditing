using Domain.Entities;

namespace Application.Repositories
{
    public interface IMinjustRepository
    {
        Task<Customer> GetInfoByPin(string pin);
        Task<TundukAteChildren> GetAteChildren(int ateId);
        Task<List<TundukAteStreets>> GetAteStreets(int ateId);
        Task<TundukSearchAddressResponse> SearchAddress(int streetId, string? building, string? apartment, string? uch);
    }
}

