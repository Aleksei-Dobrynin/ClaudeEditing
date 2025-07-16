using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface ICustomSubscribtionRepository : BaseRepository
    {
        Task<List<CustomSubscribtionIncludes>> GetAll();
        Task<List<CustomSubscribtionIncludes>> GetByIdEmployee(int id);
        Task<CustomSubscribtionIncludes> GetOneById(int id);
        Task Delete(int id);
        Task<List<CustomSubscribtionIncludes>> GetByidSubscriberType(int idSubscriberType);
        Task<List<CustomSubscribtionIncludes>> GetByidSchedule(int idSchedule);
        Task<List<CustomSubscribtionIncludes>> GetByidRepeatType(int idRepeatType);
        Task<List<CustomSubscribtionIncludes>> GetByidDocument(int idDocument);
        Task<int> Add(CustomSubscribtion domain, SubscribtionContactType domainSubscribtionContactType);
        Task<bool> Update(CustomSubscribtion domain, SubscribtionContactType domainSubscribtionContactType);
        Task<List<CustomSubscribtionIncludes>> GetByidAutoChannel(int idAutoChannel);
    }
}
