
namespace WebApi.Dtos
{
    public class telegram_questions_chats
    {
        public class Createtelegram_questions_chatsRequest
        {
            public string? chatId { get; set; }
            public DateTime? created_at { get; set; }
        }

        public class Updatetelegram_questions_chatsRequest
        {
            public int id { get; set; }
            public string? chatId { get; set; }
            public DateTime? created_at { get; set; }
        }
    }
}
