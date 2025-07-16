using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkflowSubtaskTemplateRequest
    {
        public string? name { get; set; }
        public string? description { get; set; }
        public int? workflow_task_id { get; set; }
        public int? type_id { get; set; }
    }

    public class UpdateWorkflowSubtaskTemplateRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public int? workflow_task_id { get; set; }
        public int? type_id { get; set; }
    }
}
