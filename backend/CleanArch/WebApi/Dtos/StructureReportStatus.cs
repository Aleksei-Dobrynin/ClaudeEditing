using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateStructureReportStatusRequest
    {
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }

    }
    public class UpdateStructureReportStatusRequest
    {
        public int id { get; set; }
        //public DateTime? createdAt { get; set; }
        //public DateTime? updatedAt { get; set; }
        //public int? createdBy { get; set; }
        //public int? updatedBy { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }

    }
}