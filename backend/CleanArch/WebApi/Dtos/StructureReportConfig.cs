using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateStructureReportConfigRequest
    {
        public int structureId { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }
        public bool? isActive { get; set; }
        public string? name { get; set; }

    }
    public class UpdateStructureReportConfigRequest
    {
        public int id { get; set; }
        public int structureId { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }
        public bool? isActive { get; set; }
        public string? name { get; set; }

    }
}