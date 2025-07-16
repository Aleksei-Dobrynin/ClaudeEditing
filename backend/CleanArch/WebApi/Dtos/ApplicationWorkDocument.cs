using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class AddApplicationWorkDocumentRequest
    {
        public int id { get; set; }
        public int? file_id { get; set; }
        public int? task_id { get; set; }
        public int? id_type { get; set; }
        public string? comment { get; set; }
        public int? structure_employee_id { get; set; }
        public FileModel? document { get; set; }
        public string? metadata { get; set; }
        public string? document_body { get; set; }
        public string? document_name { get; set; }
        public int? app_step_id { get; set; }
    }
}