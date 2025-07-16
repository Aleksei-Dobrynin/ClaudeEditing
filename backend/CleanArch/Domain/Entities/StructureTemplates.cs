namespace Domain.Entities
{
    public class StructureTemplates
    {
       public int id { get; set; }
       public int structure_id { get; set; }
       public int template_id { get; set; }
       public DateTime created_at { get; set; }
       public int created_by { get; set; }
       public DateTime updated_at { get; set; }
       public int updated_by { get; set; }
       public string name { get; set; }
       public string description { get; set; }
       public int idDocumentType { get; set; }
       public List<S_DocumentTemplateTranslation> translations { get; set; }
    }
}