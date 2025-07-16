using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class StructureReportModel
    {
        public int id { get; set; }
        public int statusId { get; set; }
        public int reportConfigId { get; set; }
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public int? createdBy { get; set; }
        public int? updatedBy { get; set; }
        public int? month { get; set; }
        public int? year { get; set; }
        public int? quarter { get; set; }
        public int? structureId { get; set; }

    }
}