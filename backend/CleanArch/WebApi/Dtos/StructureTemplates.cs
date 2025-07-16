using Domain.Entities;

namespace WebApi.Dtos
{
    public class CreateStructureTemplatesRequest
    {
        public string name { get; set; }
        public string description { get; set; }
        public int structure_id { get; set; }
        public List<S_DocumentTemplateTranslation> translations { get; set; }
    }
    public class UpdateStructureTemplatesRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string description { get; set; }
        public int structure_id { get; set; }
        public int template_id { get; set; }
        public List<S_DocumentTemplateTranslation> translations { get; set; }
    }
}