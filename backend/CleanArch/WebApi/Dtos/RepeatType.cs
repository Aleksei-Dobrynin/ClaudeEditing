namespace WebApi.Dtos
{
    public class CreateRepeatTypeRequest
    {
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public bool? isPeriod { get; set; }
        public int? repeatIntervalMinutes { get; set; }
    }


    public class UpdateRepeatTypeRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public bool? isPeriod { get; set; }
        public int? repeatIntervalMinutes { get; set; }
    }
}
