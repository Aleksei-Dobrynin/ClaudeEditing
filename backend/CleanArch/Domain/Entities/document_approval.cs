using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class document_approval
    {
        public int id { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? app_document_id { get; set; }
        public int? file_sign_id { get; set; }
        public int? department_id { get; set; }
        public string department_name { get; set; }
        public int? position_id { get; set; }
        public string position_name { get; set; }
        public string status { get; set; }
        public DateTime? approval_date { get; set; }
        public string comments { get; set; }
        public DateTime? created_at { get; set; }
        public FileSign signInfo { get; set; }
        public int? app_step_id { get; set; }
        public int? document_type_id { get; set; }
        public bool? is_required { get; set; }
        public bool? is_required_doc { get; set; }
        public bool? is_required_approver { get; set; }
        public string document_name { get; set; }
        public bool? is_final { get; set; }
        public int? source_approver_id { get; set; }
        public bool is_manually_modified { get; set; }
        public DateTime? last_sync_at { get; set; }
        public int? order_number { get; set; }

        /// <summary>
        /// Список назначенных исполнителей для этого подписания
        /// Формируется на основе сопоставления department_id/position_id 
        /// с данными из application_task_assignee через employee_in_structure
        /// </summary>
        public List<AssignedApprover> assigned_approvers { get; set; }
    }

    /// <summary>
    /// Назначенный исполнитель для подписания
    /// </summary>
    public class AssignedApprover
    {
        /// <summary>
        /// ID сотрудника из таблицы employee
        /// </summary>
        public int employee_id { get; set; }

        /// <summary>
        /// Краткое имя: "Иванов И.И."
        /// </summary>
        public string employee_name { get; set; }

        /// <summary>
        /// Полное имя: "Иванов Иван Иванович"
        /// </summary>
        public string employee_fullname { get; set; }

        /// <summary>
        /// ID записи в employee_in_structure
        /// </summary>
        public int structure_employee_id { get; set; }

        /// <summary>
        /// Название должности
        /// </summary>
        public string post_name { get; set; }

        /// <summary>
        /// Код должности
        /// </summary>
        public string post_code { get; set; }

        /// <summary>
        /// Название отдела/структуры
        /// </summary>
        public string structure_name { get; set; }

        /// <summary>
        /// Код отдела/структуры
        /// </summary>
        public string structure_code { get; set; }
    }
}