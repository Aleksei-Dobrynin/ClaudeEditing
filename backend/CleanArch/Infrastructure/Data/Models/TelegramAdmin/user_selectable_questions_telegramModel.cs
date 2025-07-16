using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class user_selectable_questions_telegramModel
    {
        public int id { get; set; }
        public int? questionId { get; set; }
        public string? chatId { get; set; }
        public DateTime? created_at { get; set; }
    }
}
