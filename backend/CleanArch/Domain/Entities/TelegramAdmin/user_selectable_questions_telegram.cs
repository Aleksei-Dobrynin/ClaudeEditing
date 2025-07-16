using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class user_selectable_questions_telegram
    {
        public int id { get; set; }
        public int? questionId { get; set; }
        public string? chatId { get; set; }
        public DateTime? created_at { get; set; }
    }

    public class ServiceCountTelegramByQuestions
    {
        public int count { get; set; }
        public string? name { get; set; }
    }
}
