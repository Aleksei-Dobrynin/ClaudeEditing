namespace WebApi.Dtos
{
    public class telegram_questions
    {
        public class Createtelegram_questionsRequest
        {
            public string name { get; set; }
            public int idSubject { get; set; }
            public string answer { get; set; }
            public string answer_kg { get; set; }
            public string name_kg{ get; set; }
            public List<Domain.Entities.File>? document { get; set; }
        }

        public class Updatetelegram_questionsRequest
        {
            public int id { get; set; }
            public string name { get; set; }
            public int idSubject { get; set; }
            public string answer { get; set; }
            public string answer_kg { get; set; }
            public string name_kg { get; set; }
            public List<FileUpdate>? document { get; set; }
        }

        public class FileModel
        {
            public IFormFile? file { get; set; }
            public string? name { get; set; }
        }
        public class FileUpdate
        {
            public Domain.Entities.File file { get; set; }
            public int? id { get; set; }
        }

        public class FileExcelRequest
        {
            public int file_id { get; set; }
            public FileModel? document { get; set; }
            public string? bank_id { get; set; }
        }
    }
}
