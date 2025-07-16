using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class StructureReportConfig
    {
        public int id { get; set; }
        public int structureId { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public int? createdBy { get; set; }
        public int? updatedBy { get; set; }
        public bool? isActive { get; set; }
        public string? name { get; set; }
        public string? structure_name { get; set; }
    }
}