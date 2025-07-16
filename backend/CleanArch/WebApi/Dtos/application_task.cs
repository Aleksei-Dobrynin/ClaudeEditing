using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_taskRequest
    {
        public int id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? structure_id { get; set; }
		public int application_id { get; set; }
		public int? task_template_id { get; set; }
		public string? comment { get; set; }
		public string name { get; set; }
		public bool? is_required { get; set; }
		public int? order { get; set; }
		public int status_id { get; set; }
		public int? progress { get; set; }
        public int? type_id { get; set; }
        public DateTime? deadline { get; set; }
        public FileModel? document { get; set; }
		public string? employee_in_structure_ids { get; set; }
    }
    public class Updateapplication_taskRequest
    {
        public int id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? structure_id { get; set; }
		public int application_id { get; set; }
		public int? task_template_id { get; set; }
		public string? comment { get; set; }
		public string name { get; set; }
		public bool? is_required { get; set; }
		public int? order { get; set; }
		public int status_id { get; set; }
		public int? progress { get; set; }
        public int? type_id { get; set; }
        public DateTime? deadline { get; set; }
        public FileModel? document { get; set; }
    }
}