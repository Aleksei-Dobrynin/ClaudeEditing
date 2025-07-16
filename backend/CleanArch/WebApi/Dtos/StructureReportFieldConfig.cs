using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateStructureReportFieldConfigRequest
    {
        public int structureReportId { get; set; }
        public string? fieldName { get; set; }
        public string? reportItem { get; set; }
        public List<int> unitTypes { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }

    }
    public class UpdateStructureReportFieldConfigRequest
    {
        public int id { get; set; }
        public int structureReportId { get; set; }
        public string? fieldName { get; set; }
        public string? reportItem { get; set; }
        public List<int> unitTypes { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }

    }
}