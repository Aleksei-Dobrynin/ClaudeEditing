namespace WebApi.Dtos
{
    public class user_selectable_questions_telegram
    {
        public class Createuser_selectable_questions_telegramRequest
        {
            public int? questionId { get; set; }
            public string? chatId { get; set; }
            public DateTime? created_at { get; set; }
        }

        public class Updateuser_selectable_questions_telegramRequest
        {
            public int id { get; set; }
            public int? questionId { get; set; }
            public string? chatId { get; set; }
            public DateTime? created_at { get; set; }
        }
    }
}
