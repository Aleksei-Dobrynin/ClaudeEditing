namespace WebApi.Dtos
{
    public class CreateSystemSettingRequest
    {
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public string value { get; set; }
    }
    
    public class UpdateSystemSettingRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string code { get; set; }
        public string value { get; set; }
    }
}