using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateApplicationFilterTypeRequest
    {
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? post_id { get; set; }
        public int? structure_id { get; set; }
    }

    public class UpdateApplicationFilterTypeRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? post_id { get; set; }
        public int? structure_id { get; set; }
    }
}
