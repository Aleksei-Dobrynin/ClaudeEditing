using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ArchiveLog : BaseLogDomain
    {
        public int id { get; set; }
        public string? created_by_name { get; set; }
        public string? updated_by_name { get; set; }
        public string? doc_number { get; set; }
        public string? address { get; set; }
        public int? status_id { get; set; }
        public int? archive_folder_id { get; set; }
        public string? status_name { get; set; }
        public DateTime? date_return { get; set; }
        public int? take_structure_id { get; set; }
        public string? take_structure_name { get; set; }
        public int? take_employee_id { get; set; }
        public string? take_employee_name { get; set; }
        public int? return_structure_id { get; set; }
        public string? return_structure_name { get; set; }
        public int? return_employee_id { get; set; }
        public string? return_employee_name { get; set; }
        public DateTime? date_take { get; set; }
        public string? name_take { get; set; }
        public DateTime? deadline { get; set; }
        public List<ArchiveObjectsInLog>? archiveObjects { get; set; }
        public int? archive_object_id { get; set; }
        public bool? is_group { get; set; }
        public int? parent_id { get; set; }
    }
    
    public class ArchiveLogFilter
    {
        public string? doc_number { get; set; }
        public int? employee_id { get; set; }
    }
    
    public class ArchiveObjectsInLog
    {
        public int id { get; set; }
        public string? doc_number { get; set; }
        public string? address { get; set; }
    }

    public class ArchiveLogPivot
    {
        public string employee { get; set; }
        public string status { get; set; }

        public string structure { get; set; }
        public string gradation { get; set; }

        public string year { get; set; }
        public string month { get; set; }
        public string day { get; set; }
        public DateTime created_at { get; set; }
    }
}