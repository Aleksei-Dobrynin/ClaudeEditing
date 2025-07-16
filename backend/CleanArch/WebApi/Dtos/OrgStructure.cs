using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateOrgStructureRequest
    {
        public int? parent_id { get; set; }
        public string? unique_id { get; set; }
        public string? name { get; set; }
        public string? version { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public string? remote_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public string? short_name { get; set; }
    }

    public class UpdateOrgStructureRequest
    {
        public int id { get; set; }
        public int? parent_id { get; set; }
        public string? unique_id { get; set; }
        public string? name { get; set; }
        public string? version { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public string? remote_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public string? short_name { get; set; }
    }
}
