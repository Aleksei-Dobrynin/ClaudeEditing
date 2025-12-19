using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createdocument_approval_sync_logRequest
    {
        public int? document_approval_id { get; set; }
        public int? old_department_id { get; set; }
        public int? new_department_id { get; set; }
        public int? old_position_id { get; set; }
        public int? new_position_id { get; set; }
        public string sync_reason { get; set; }
        public DateTime? synced_at { get; set; }
        public int? synced_by { get; set; }
        public string operation_type { get; set; }
    }

    public class Updatedocument_approval_sync_logRequest
    {
        public int id { get; set; }
        public int? document_approval_id { get; set; }
        public int? old_department_id { get; set; }
        public int? new_department_id { get; set; }
        public int? old_position_id { get; set; }
        public int? new_position_id { get; set; }
        public string sync_reason { get; set; }
        public DateTime synced_at { get; set; }
        public int? synced_by { get; set; }
        public string operation_type { get; set; }
    }
}