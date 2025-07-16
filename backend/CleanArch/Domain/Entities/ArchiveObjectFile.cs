using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ArchiveObjectFile : BaseLogDomain
    {
        public int id { get; set; }
        public int archive_object_id { get; set; }
        public int? archive_folder_id { get; set; }
        public string archive_folder_name { get; set; }
        public int file_id { get; set; }
        public string? name { get; set; }
        public string? file_name { get; set; }
        public string? object_address { get; set; }
        public string? object_number { get; set; }
        public File document { get; set; }
        public List<archive_doc_tag> tags { get; set; }
    }
}
