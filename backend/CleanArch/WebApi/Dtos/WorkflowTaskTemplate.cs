using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateWorkflowTaskTemplateRequest
    {
        public int? workflow_id { get; set; }
        public string? name { get; set; }
        public int? order { get; set; }
        public bool? is_active { get; set; }
        public bool? is_required { get; set; }
        public string? description { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? structure_id { get; set; }
        public int? type_id { get; set; }
    }

    public class UpdateWorkflowTaskTemplateRequest
    {
        public int id { get; set; }
        public int? workflow_id { get; set; }
        public string? name { get; set; }
        public int? order { get; set; }
        public bool? is_active { get; set; }
        public bool? is_required { get; set; }
        public string? description { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? structure_id { get; set; }
        public int? type_id { get; set; }
    }
}
