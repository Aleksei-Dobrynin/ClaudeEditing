using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IRepeatTypeRepository : BaseRepository
    {
        Task<List<RepeatType>> GetAll();
        Task Delete(int id);
        Task<int> Add(RepeatType domain);
        Task Update(RepeatType domain);
        Task<RepeatType> GetOneById(int id);
    }
}
