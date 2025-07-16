using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class StructureReportField
    {
        public int id { get; set; }
        public int reportId { get; set; }
        public int? fieldId { get; set; }
        public string? field_name { get; set; }
        public string? report_item { get; set; }
        public int? unitId { get; set; }
        public string unitName { get; set; } 
        public int? value { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public int? createdBy { get; set; }
        public int? updatedBy { get; set; }
    }
}