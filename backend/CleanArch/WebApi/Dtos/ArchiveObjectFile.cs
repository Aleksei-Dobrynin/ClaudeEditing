using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateArchiveObjectFileRequest
    {
        public int archive_object_id { get; set; }
        public int? archive_folder_id { get; set; }
        public int file_id { get; set; }
        public string? name { get; set; }
        public FileModel? document { get; set; }
    }

    public class UpdateArchiveObjectFileRequest
    {
        public int id { get; set; }
        public int archive_object_id { get; set; }
        public int? archive_folder_id { get; set; }
        public int file_id { get; set; }
        public string? name { get; set; }
    }
}
