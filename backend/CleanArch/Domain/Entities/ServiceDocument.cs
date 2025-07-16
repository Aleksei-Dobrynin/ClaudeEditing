using System.Xml.Linq;

namespace Domain.Entities
{
    public class ServiceDocument : BaseLogDomain
    {
        public int id { get; set; }
        public int? service_id { get; set; }
        public int? file_id { get; set; }
        public string? service_name { get; set; }
        public int? application_document_id { get; set; }
        public int? application_document_type_id { get; set; }
        public string? application_document_name { get; set; }
        public string? application_document_type_name { get; set; }
        public string? application_document_name_kg { get; set; }
        public string? application_document_type_name_kg { get; set; }
        public bool? is_required { get; set; }
        public bool? is_outcome { get; set; }
    }

    public class ApplicationDocumentByService
    {
        public int Id { get; set; }                    // ID из application_document
        public string Name { get; set; }               // Название документа
        public string NameKg { get; set; }             // Название на кыргызском (опционально)
        public string Code { get; set; }               // Код документа (опционально)
        public string Description { get; set; }        // Описание (опционально)
        public string DescriptionKg { get; set; }      // Описание на кыргызском (опционально)
        public string LawDescription { get; set; }     // Правовое обоснование (опционально)
        public int DocumentTypeId { get; set; }        // ID типа документа
        public bool? DocIsOutcome { get; set; }        // Исходящий документ (опционально)
        public bool IsRequired { get; set; }           // Обязательность (из service_document)
        public string TextColor { get; set; }          // Цвет текста (опционально)
        public string BackgroundColor { get; set; }    // Цвет фона (опционально)
    }
}
