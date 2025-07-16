using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_subtask: BaseEntity
    {
        public int id { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int application_id { get; set; }
		public string application_number { get; set; }
		public int? subtask_template_id { get; set; }
		public string name { get; set; }
		public int status_id { get; set; }
		public string status_name { get; set; }
		public string status_code { get; set; }
        public int? progress { get; set; }
		public int application_task_id { get; set; }
		public int application_task_structure_id { get; set; }
        public string application_task_name { get; set; }
        public string description { get; set; }
		public DateTime? created_at { get; set; }
        public int? type_id { get; set; }
        public string type_name { get; set; }
        public string status_back_color { get; set; }
        public string status_text_color { get; set; }
        public string? employees { get; set; }
        public DateTime? subtask_deadline { get; set; }
        public List<application_subtask_assignee> assignees { get; set; }
        public Validation Validate()
        {
            var errors = new List<FieldError>();
            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add(new FieldError { ErrorCode = nameof(ErrorCode.COMMON_NOT_EMPTY_STRING_FIELD), FieldName = "name" });
            }
            if (errors.Count > 0)
            {
                return Validation.NotValid(errors);
            }
            return Validation.Valid();
        }
    }
}