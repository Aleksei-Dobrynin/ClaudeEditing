using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface Itelegram_questionsRepository : BaseRepository
    {
        Task<List<Domain.Entities.telegram_questions>> GetAll();
        Task<Domain.Entities.telegram_questions> GetById(int id);
        Task<List<Domain.Entities.telegram_questions>> GetByIdSubject(int id);
        Task<int> Add(Domain.Entities.telegram_questions domain);
        Task<int> CreateQuestionFiles(Domain.Entities.telegram_questions_file domain);
        Task DeleteQuestionFile(int id);
        Task<List<telegram_questions_file>> FindQuestionFiles( int questionId);
        Task Update(Domain.Entities.telegram_questions domain);
        Task Delete(int id);
    }
}
