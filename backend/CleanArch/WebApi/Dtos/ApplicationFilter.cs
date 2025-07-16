using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateApplicationFilterRequest
    {
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? type_id { get; set; }
        public int? query_id { get; set; }
        public int? post_id { get; set; }
        public string? parameters { get; set; }
    }

    public class UpdateApplicationFilterRequest
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? type_id { get; set; }
        public int? query_id { get; set; }
        public int? post_id { get; set; }
        public string? parameters { get; set; }
    }
}
