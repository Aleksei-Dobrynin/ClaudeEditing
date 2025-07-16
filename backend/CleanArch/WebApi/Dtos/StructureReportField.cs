using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateStructureReportFieldRequest
    {
        public int reportId { get; set; }
        public int? fieldId { get; set; }
        public int? unitId { get; set; }
        public int? value { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }

    }
    public class UpdateStructureReportFieldRequest
    {
        public int id { get; set; }
        public int reportId { get; set; }
        public int? fieldId { get; set; }
        public int? unitId { get; set; }
        public int? value { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }

    }
}