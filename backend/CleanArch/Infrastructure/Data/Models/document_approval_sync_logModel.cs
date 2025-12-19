using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class document_approval_sync_logModel
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