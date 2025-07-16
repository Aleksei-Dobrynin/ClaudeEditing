using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateTechCouncilRequest
    {
        public int structure_id { get; set; }
        public int application_id { get; set; }
        public string? decision { get; set; }
        public int? decision_type_id { get; set; }
    }
    public class UpdateTechCouncilRequest
    {
        public int id { get; set; }
        public int structure_id { get; set; }
        public int application_id { get; set; }
        public string? decision { get; set; }
        public int? decision_type_id { get; set; }
    }
    
    public class SendToTechCouncilRequest
    {
        public int application_id { get; set; }
        public List<int> participants { get; set; }
    }
    
    public class UploadFileTechCouncilRequest
    {
        public int id { get; set; }
        public int structure_id { get; set; }
        public int application_id { get; set; }
        public FileModel? document { get; set; }
    }
    
    public class UpdateSessionRequest
    {
        public List<int> application_ids { get; set; }
        public int? session_id { get; set; }
    }
    
    public class UpdateSessionOneCaseRequest
    {
        public int? application_id { get; set; }
        public int? session_id { get; set; }
    }
}