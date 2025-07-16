using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface Iuser_selectable_questions_telegramRepository : BaseRepository
    {
        Task<List<Domain.Entities.user_selectable_questions_telegram>> GetAll();
        Task<Domain.Entities.user_selectable_questions_telegram> GetById(int id);
        Task<Domain.Entities.user_selectable_questions_telegram> GetByChatId(string chatId);
        Task<int> Create(Domain.Entities.user_selectable_questions_telegram domain);
        Task Update(Domain.Entities.user_selectable_questions_telegram domain);
        Task<List<ServiceCountTelegramByQuestions>> GetClicked(DateTime startDate, DateTime? endDate);
        Task Delete(int id);
    }
}
