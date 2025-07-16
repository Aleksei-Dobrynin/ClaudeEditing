using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class telegram_questions_chats
    {
        public int id { get; set; }
        public string? chatId { get; set; }
        public DateTime? created_at { get; set; }
    }
    public class ServiceCountTelegram
    {
        public int count { get; set; }
        public string? name { get; set; }
    }

    
}
