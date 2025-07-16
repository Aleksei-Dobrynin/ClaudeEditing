using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface Itelegram_subjectsRepository : BaseRepository
    {
        Task<List<Domain.Entities.telegram_subjects>> GetAll();
        Task<Domain.Entities.telegram_subjects> GetById(int id);
        Task<int> Add(Domain.Entities.telegram_subjects domain);
        Task Update(Domain.Entities.telegram_subjects domain);
        Task Delete(int id);
    }
}
