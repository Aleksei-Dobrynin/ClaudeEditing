using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkflowTaskDependencyRequest
    {
        public int? task_id { get; set; }
        public int? dependent_task_id { get; set; }
    }

    public class UpdateWorkflowTaskDependencyRequest
    {
        public int id { get; set; }
        public int? task_id { get; set; }
        public int? dependent_task_id { get; set; }
    }
}
