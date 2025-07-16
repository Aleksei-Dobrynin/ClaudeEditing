using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Application.Repositories;

namespace Infrastructure.Tunduk
{
    public class MinjustRepository : IMinjustRepository
    {
        private readonly IConfiguration _configuration;

        public MinjustRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public Task<Customer> GetInfoByPin(string pin)
        {
            var minjustData = _configuration.GetSection("Tunduk:Minjust").Get<List<Customer>>();

            if (minjustData == null)
            {
                return Task.FromResult<Customer>(null);
            }

            var entry = minjustData.FirstOrDefault(x => x.pin == pin);

            return Task.FromResult(entry);
        }
    }
}

