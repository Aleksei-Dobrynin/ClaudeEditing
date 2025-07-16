using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IScheduleTypeRepository : BaseRepository
    {
        Task<List<ScheduleType>> GetAll();
        Task Delete(int id);
        Task<int> Add(ScheduleType domain);
        Task Update(ScheduleType domain);
        Task<ScheduleType> GetOneById(int id);
    }
}
