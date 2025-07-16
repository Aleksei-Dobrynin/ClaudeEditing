using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace WebApi.Dtos
{
    public class CreateArchiveLogRequest
    {
        public string? doc_number { get; set; }
        public string? address { get; set; }
        public int? status_id { get; set; }
        public int? archive_folder_id { get; set; }
        public DateTime? date_return { get; set; }
        public DateTime? deadline { get; set; }
        public int? take_structure_id { get; set; }
        public int? take_employee_id { get; set; }
        public int? return_structure_id { get; set; }
        public int? return_employee_id { get; set; }
        public DateTime? date_take { get; set; }
        public string? name_take { get; set; }
        //public List<ArchiveObjectsInLog>? archiveObjects { get; set; }
    }

    public class UpdateArchiveLogRequest
    {
        public int id { get; set; }
        public string? doc_number { get; set; }
        public string? address { get; set; }
        public int? status_id { get; set; }
        public int? archive_folder_id { get; set; }
        public DateTime? date_return { get; set; }
        public DateTime? deadline { get; set; }
        public int? take_structure_id { get; set; }
        public int? take_employee_id { get; set; }
        public int? return_structure_id { get; set; }
        public int? return_employee_id { get; set; }
        public DateTime? date_take { get; set; }
        public string? name_take { get; set; }
    }
    
    public class ChangeArchiveLogStatusRequest
    {
        public int archive_log_id { get; set; }
        
        public int status_id { get; set; }
    }
}
