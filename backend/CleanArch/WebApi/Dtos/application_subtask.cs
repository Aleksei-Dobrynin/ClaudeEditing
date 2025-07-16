using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createapplication_subtaskRequest
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int application_id { get; set; }
		public int? subtask_template_id { get; set; }
		public string name { get; set; }
		public int status_id { get; set; }
		public int? progress { get; set; }
		public int application_task_id { get; set; }
		public string description { get; set; }
		public DateTime? created_at { get; set; }
        public int? type_id { get; set; }
        public DateTime? deadline { get; set; }
        public List<application_subtask_assignee> assignees { get; set; }


    }
    public class Updateapplication_subtaskRequest
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int application_id { get; set; }
		public int? subtask_template_id { get; set; }
		public string name { get; set; }
		public int status_id { get; set; }
		public int? progress { get; set; }
		public int application_task_id { get; set; }
		public string description { get; set; }
		public DateTime? created_at { get; set; }
        public int? type_id { get; set; }
        public DateTime? deadline { get; set; }
        public List<application_subtask_assignee> assignees { get; set; }


    }
}