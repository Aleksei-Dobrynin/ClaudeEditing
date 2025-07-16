using System.Globalization;

namespace WebApi.Dtos
{
    public class CreateScheduleTypeRequest
    {
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
    }


    public class UpdateScheduleTypeRequest
    {
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public int id { get; set; }
    }
}
