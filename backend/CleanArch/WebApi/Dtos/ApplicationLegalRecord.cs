
namespace WebApi.Dtos
{
    public class CreateApplicationLegalRecordRequest
    {
        public int id_application { get; set; }
        public int id_legalrecord { get; set; }
        public int id_legalact { get; set; }
    }
    
    public class UpdateApplicationLegalRecordRequest
    {
        public int id { get; set; }
        public int id_application { get; set; }
        public int id_legalrecord { get; set; }
        public int id_legalact { get; set; }
    }
}