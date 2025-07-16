namespace WebApi.Dtos
{
    public class telegram_subjects
    {
        public class Createtelegram_subjectsRequest
        {
            public string name { get; set; }
            public string name_kg { get; set; }
        }

        public class Updatetelegram_subjectsRequest
        {
            public int id { get; set; }
            public string name { get; set; }
            public string name_kg { get; set; }
        }
    }
}
