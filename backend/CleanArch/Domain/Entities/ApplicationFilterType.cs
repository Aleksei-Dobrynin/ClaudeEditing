using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ApplicationFilterType
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? post_id { get; set; }
        public int? structure_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
    }
}
