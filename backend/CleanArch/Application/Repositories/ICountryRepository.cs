using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface ICountryRepository: BaseRepository
    {
        Task<List<Country>> GetAll();
        Task<Country> GetOne(int id);
    }
}
