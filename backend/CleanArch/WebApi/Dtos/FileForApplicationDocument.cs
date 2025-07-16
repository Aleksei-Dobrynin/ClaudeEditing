using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateFileForApplicationDocumentRequest
    {
        public int file_id { get; set; }
        public int document_id { get; set; }
        public int type_id { get; set; }
        public string? name { get; set; }
        public FileModel? document { get; set; }
    }

    public class UpdateFileForApplicationDocumentRequest
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public int document_id { get; set; }
        public int type_id { get; set; }
        public string? name { get; set; }
        public FileModel document { get; set; }
    }

    public class FileModel
    {
        public IFormFile? file { get; set; }
        public string? name { get; set; }
    }

    public class FileExcelRequest
    {
        public int file_id { get; set; }
        public FileModel? document { get; set; }
        public string? bank_id { get; set; }
    }
}
