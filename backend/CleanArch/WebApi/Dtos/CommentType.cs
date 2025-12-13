namespace WebApi.Dtos
{
    public class CreateCommentTypeRequest
    {
        public string? name { get; set; }
        public string? code { get; set; }
        public string? button_label { get; set; }
        public string? button_color { get; set; }
    }
    
    public class UpdateCommentTypeRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? button_label { get; set; }
        public string? button_color { get; set; }
    }
}
