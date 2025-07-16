using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface  Itelegram_questions_fileRepository : BaseRepository
    {
        Task DeleteByIdQuestion(int isQuestion);
        Task Delete(int id);
    }
}
