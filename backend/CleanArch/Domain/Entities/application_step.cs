using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_step
    {
        public int id { get; set; }
        public bool? is_overdue { get; set; }
        public int? overdue_days { get; set; }
        public bool? is_paused { get; set; }
        public string name { get; set; }
        public string comments { get; set; }
        public DateTime? created_at { get; set; }
        public int? created_by { get; set; }
        public DateTime? updated_at { get; set; }
        public int? updated_by { get; set; }
        public int? application_id { get; set; }
        public int? step_id { get; set; }

        /// <summary>
        /// КРИТИЧНО: order_number теперь int (не nullable!)
        /// Обязательное поле после миграции
        /// </summary>
        public int order_number { get; set; }

        public int? path_id { get; set; }
        public int? responsible_department_id { get; set; }
        public string status { get; set; }
        public DateTime? start_date { get; set; }
        public DateTime? due_date { get; set; }
        public DateTime? completion_date { get; set; }
        public int? planned_duration { get; set; }
        public int? actual_duration { get; set; }
        public int[] dependencies { get; set; }
        public int[] blocks { get; set; }
        public List<FileSign> signs { get; set; }
        public List<step_required_document> docs { get; set; }
        public List<StepDocument> documents { get; set; }
        public List<ApplicationWorkDocument> workDocuments { get; set; }
        public List<ApplicationRequiredCalc> requiredCalcs { get; set; }

        /// <summary>
        /// Признак динамически добавленного шага
        /// TRUE = шаг добавлен динамически из другой услуги
        /// FALSE/NULL = обычный шаг из исходного service_path
        /// </summary>
        public bool? is_dynamically_added { get; set; }

        /// <summary>
        /// ID service_path, из которого добавлен этот шаг
        /// Заполняется только для динамических шагов (is_dynamically_added = true)
        /// </summary>
        public int? additional_service_path_id { get; set; }

        /// <summary>
        /// Исходный порядковый номер шага в service_path-источнике
        /// Сохраняем для трассировки откуда взят шаг
        /// </summary>
        public int? original_step_order { get; set; }

        /// <summary>
        /// Ссылка на запись о добавлении услуги (application_additional_service.id)
        /// Используется для группировки всех шагов одной добавленной услуги
        /// </summary>
        public int? added_by_link_id { get; set; }

        /// <summary>
        /// Флаг мягкого удаления
        /// TRUE = запись удалена (скрыта из обычных выборок)
        /// FALSE/NULL = активная запись
        /// </summary>
        public bool? is_deleted { get; set; }
    }

    public class StepDocument
    {
        public int id { get; set; }
        public int? upl_id { get; set; }
        public uploaded_application_document upl { get; set; }
        public int? document_type_id { get; set; }
        public string document_type_name { get; set; }
        public int? service_document_id { get; set; }
        public bool can_assign { get; set; }
        public string assign_status { get; set; }
        public List<document_approval> approvals { get; set; }
        public bool? is_required { get; set; }
    }

    public class UnsignedDocumentsModel
    {
        public int uploaded_document_id { get; set; }
        public string document_name { get; set; }
        public int app_id { get; set; }
        public string app_number { get; set; }
        public string app_work_description { get; set; }
        public string arch_object_address { get; set; }
        public string full_name { get; set; }
        public string service_name { get; set; }
        public int? service_days { get; set; }
        public DateTime? deadline { get; set; }
        public string document_status { get; set; }
        public string pin { get; set; }
        public int? task_id { get; set; }
        public int? app_step_id { get; set; }
    }

    public class ApplicationUnsignedDocumentsModel
    {
        public int app_id { get; set; }
        public string app_number { get; set; }
        public string app_work_description { get; set; }
        public string arch_object_address { get; set; }
        public string full_name { get; set; }
        public string pin { get; set; }
        public string service_name { get; set; }
        public int? service_days { get; set; }
        public DateTime? deadline { get; set; }
        public int? task_id { get; set; }
        public int? app_step_id { get; set; }
        public List<UnsignedDocumentsModel> documents { get; set; }
    }
}