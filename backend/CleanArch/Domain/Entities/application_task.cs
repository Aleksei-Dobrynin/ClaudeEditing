using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_task : BaseEntity
    {
        public int id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public int? structure_id { get; set; }
		public string structure_idNavName { get; set; }
        public string? structure_idNavShortName { get; set; }
        public int application_id { get; set; }
        public string application_number { get; set; }
        public int? task_template_id { get; set; }
		public string comment { get; set; }
		public string name { get; set; }
		public bool? is_required { get; set; }
		public int? order { get; set; }
		public int status_id { get; set; }
		public string status_idNavName { get; set; }
		public string status_code { get; set; }
		public string status_name { get; set; }
        public int? progress { get; set; }
		public int subtasks { get; set; }
		public int done_subtasks { get; set; }
        public int? type_id { get; set; }
        public string type_name { get; set; }
        public string status_back_color { get; set; }
        public string status_text_color { get; set; }
        public string? full_name { get; set; }
        public string? pin { get; set; }
        public string? contact { get; set; }
        public string? address { get; set; }
        public string? district { get; set; }
        public string? assignees { get; set; }
        public string? work_description { get; set; }
        public string? service_name { get; set; }
        public int service_id { get; set; }
        public DateTime? task_deadline { get; set; }
        public DateTime? app_deadline { get; set; }
        public int? application_square_id { get; set; }
        public double? application_square_value { get; set; }
        public int? application_square_unit_type_id { get; set; }
        public int? application_status_id { get; set; }
        public string? application_status_code { get; set; }
        public string? application_status_group_code { get; set; }
        public string application_status_color { get; set; }
        public bool is_main { get; set; }
        public File? document { get; set; }
        public string? employee_in_structure_ids { get; set; }
        public List<application_task_assignee> employees { get; set; }
        public Validation Validate()
        {
            var errors = new List<FieldError>();
            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add(new FieldError { ErrorCode = nameof(ErrorCode.COMMON_NOT_EMPTY_STRING_FIELD), FieldName = "name" });
            }
            if (structure_id == null)
            {
                errors.Add(new FieldError { ErrorCode = nameof(ErrorCode.COMMON_ID_NOT_NULL), FieldName = "structure_id" });
            }
            if (errors.Count > 0)
            {
                return Validation.NotValid(errors);
            }
            return Validation.Valid();
        }


    }

    public class datanested
    {
        public mytasknested data { get; set; }
        public List<datanested> children { get; set; }
        public int id { get; set; }
        public int key { get; set; }
    }

    public class mytasknested
    {
        public int id { get; set; }
        public string name { get; set; }
        public string application_number { get; set; }
        public string structure_idNavName { get; set; }
        public int application_id { get; set; }
        public string status_idNavName { get; set; }
        public string status_code { get; set; }
        public string status_textcolor { get; set; }
        public string status_backcolor { get; set; }
        public int done_subtasks { get; set; }
        public int subtasks { get; set; }
        public string type_name { get; set; }
        public string comment { get; set; }
        public bool is_task { get; set; }
        public List<mytasknested> children { get; set; }
        public string? full_name { get; set; }
        public string? pin { get; set; }
        public string? contact { get; set; }
        public string? assignees { get; set; }
        public string? work_description { get; set; }
        public string? address { get; set; }
        public string? service_name { get; set; }
        public DateTime? deadline { get; set; }
        public DateTime? app_deadline { get; set; }

    }

    public class ApplicationTaskPivot
    {
        public string employee { get; set; }
        public string status { get; set; }

        public string structure { get; set; }

        public string type { get; set; }

        public string year { get; set; }
        public string month { get; set; }
        public string day { get; set; }
        public bool? is_main { get; set; }
        public DateTime created_at { get; set; }
    }
}