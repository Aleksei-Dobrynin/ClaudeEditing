using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ApplicationFilter
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? type_id { get; set; }
        public int? query_id { get; set; }
        public int? post_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public string? type_name { get; set; }
        public string? type_code { get; set; }
        public string? query_sql { get; set; }
        public string? parameters { get; set; }
    }
    
    public class ApplicationFilterGetRequest
    {
        public List<int> Posts { get; set; }
        public List<int> Structure { get; set; }
    }
}