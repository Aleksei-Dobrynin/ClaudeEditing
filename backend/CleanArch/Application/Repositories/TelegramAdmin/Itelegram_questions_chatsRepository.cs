using Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface Itelegram_questions_chatsRepository : BaseRepository
    {
        Task<List<Domain.Entities.telegram_questions_chats>> GetAll();
        Task<Domain.Entities.telegram_questions_chats> GetById(int id);
        Task<Domain.Entities.telegram_questions_chats> GetByChatId(string chatId);
        Task<int> Create(Domain.Entities.telegram_questions_chats domain);
        Task Update(Domain.Entities.telegram_questions_chats domain);
        Task<List<ServiceCountTelegram>> GetNumberOfChats();
        Task<List<ServiceCountTelegram>> GetNumberOfChatsByDate(DateTime startDate, DateTime? endDate);
        Task Delete(int id);
    }
}
