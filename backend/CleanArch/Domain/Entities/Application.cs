
using System.Xml.Linq;
using Newtonsoft.Json;

namespace Domain.Entities
{
    public class ApplicationCashedInfo
    {
        public List<int> assignee_ids { get; set; }
        public string assignees { get; set; }
        public string arch_objects { get; set; }
        public List<int> district_ids { get; set; }
        public string district_names { get; set; }
        public string customer { get; set; }
        public string customer_contacts { get; set; }
        public string customer_pin { get; set; }
        public string comments { get; set; }
        public string? registrator_name { get; set; }
        public int? registrator_id { get; set; }
        public string? dp_registrator_name { get; set; }
        public int? dp_registrator_id { get; set; }
        public DateTime? dp_created_at { get; set; }
    }
    public class Application : BaseLogDomain
    {
        public int id { get; set; }
        public DateTime? registration_date { get; set; }
        public DateTime? done_date { get; set; }
        public int customer_id { get; set; }
        public string customer_name { get; set; }
        public string customer_pin { get; set; }
        public int status_id { get; set; }
        public int workflow_id { get; set; }
        public int service_id { get; set; }
        public int? workflow_task_structure_id { get; set; }
        public string service_name { get; set; }
        public string service_name_kg { get; set; }
        public string? created_by_name { get; set; }
        public string? assigned_employees_names { get; set; }
        public string? updated_by_name { get; set; }
        public DateTime? deadline { get; set; }
        public int? arch_object_id { get; set; }
        public string? arch_object_name { get; set; }
        public string? arch_object_address { get; set; }
        public string? arch_object_district { get; set; }
        public int? district_id { get; set; }
        public bool? is_paid { get; set; }
        public string? number { get; set; }
        public string status_name { get; set; }
        public string status_name_kg { get; set; }
        public string status_code { get; set; }
        public string? status_color { get; set; }
        public string object_tag_name { get; set; }
        public bool? customer_is_organization { get; set; }
        public string customer_address { get; set; }
        public string customer_organization_type_name { get; set; }
        public string customer_okpo { get; set; }
        public string customer_director { get; set; }
        public int? maria_db_statement_id { get; set; }
        public string? work_description { get; set; }
        public string? customer_contacts { get; set; }
        public Customer customer { get; set; }
        public List<ArchObject> archObjects { get; set; }
        public string? assignee_employees { get; set; }
        public List<string> customers_info { get; set; }
        public string comments { get; set; }
        public int reestr_id { get; set; }
        public int? object_tag_id { get; set; }
        public string reestr_name { get; set; }
        public int? arch_process_id { get; set; }
        public int? tech_decision_id { get; set; }
        public DateTime? tech_decision_date { get; set; }
        public string incoming_numbers { get; set; }
        public string outgoing_numbers { get; set; }
        public decimal sum_wo_discount { get; set; }
        public decimal total_sum { get; set; }
        public decimal old_sum { get; set; }
        public decimal pure_sum { get; set; }
        public decimal discount_percentage { get; set; }
        public decimal discount_value { get; set; }
        public decimal nds_value { get; set; }
        public decimal nsp_value { get; set; }
        public decimal nds_percentage { get; set; }
        public decimal nsp_percentage { get; set; }
        public bool has_discount { get; set; }
        public int calc_updated_by { get; set; }
        public int calc_created_by { get; set; }
        public DateTime? calc_created_at { get; set; }
        public DateTime? calc_updated_at { get; set; }
        public decimal total_payed { get; set; }
        public int? day_count { get; set; }
        public string dp_outgoing_number { get; set; }
        public string cashed_info { get; set; }
        public string? application_code { get; set; }
        public bool? matched_contact { get; set; }
        public bool? saveWithoutCheck { get; set; }
        public string? app_cabinet_uuid { get; set; }
        public string? dogovorTemplate { get; set; } //TODO delete
        public string? cabinet_html { get; set; } //TODO delete
        public bool? is_electronic_only { get; set; }
        public string? journal_name { get; set; }
        public string? journal_outgoing_number { get; set; }
        public DateTime? journal_added_at { get; set; }
        public bool? is_favorite { get; set; }

        public application_step current_step { get; set; }
        public Validation Validate()
        {
            var errors = new List<FieldError>();
            if (service_id == 0)
            {
                errors.Add(new FieldError { ErrorCode = nameof(ErrorCode.COMMON_ID_NOT_NULL), FieldName = "service_id" });
            }
            if (errors.Count > 0)
            {
                return Validation.NotValid(errors);
            }
            return Validation.Valid();
        }
    }

    public class PaginationFields
    {
        public int pageSize { get; set; }
        public int pageNumber { get; set; }
        public string? sort_by { get; set; }
        public string? sort_type { get; set; }
        public string pin { get; set; }
        public string? customerName { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int[] service_ids { get; set; }
        public int[] status_ids { get; set; }
        public string? address { get; set; }
        public string? number { get; set; }
        public int? district_id { get; set; }
        public int? journals_id { get; set; }
        public bool? is_journal { get; set; }
        public int? deadline_day { get; set; }
        public int? tag_id { get; set; }
        public bool? isExpired { get; set; }
        public int? employee_id { get; set; }
        public int? structure_id { get; set; }
        public string common_filter { get; set; }
        public bool useCommon { get; set; }
        public int[]? structure_ids { get; set; }
        public int[]? employees_ids { get; set; }
        public bool? isMyOrgApplication { get; set; }
        public bool? withoutAssignedEmployee { get; set; }
        public string? incoming_numbers { get; set; }
        public string? outgoing_numbers { get; set; }
        public int? employee_arch_id { get; set; }
        public int? issued_employee_id { get; set; }
        public DateTime? dashboard_date_start { get; set; }
        public DateTime? dashboard_date_end { get; set; }
        public bool only_count { get; set; }
        public string? application_code { get; set; }
        public bool? is_paid { get; set; }
        public bool? only_cabinet { get; set; }
        public int? total_payed_from { get; set; }
        public int? total_payed_to { get; set; }
        public int? total_sum_from { get; set; }
        public int? total_sum_to { get; set; }
        public int[]? app_ids { get; set; }

        public int? tunduk_district_id { get; set; }
        public int? tunduk_address_unit_id { get; set; }
        public int? tunduk_street_id { get; set; }
        public bool? for_signature { get; set; }
        public bool? isAssignedToMe { get; set; }
        public bool? isFavorite { get; set; }
        public int? currentEmployeeId { get; set; }
    }

    public class PaidAmmount
    {
        public decimal total_payed { get; set; }
        public decimal total_sum { get; set; }
    }


    public class ApplicationPivot
    {
        public string gradation { get; set; }
        public string status { get; set; }
        public string object_name { get; set; }

        public string service_name { get; set; }

        public string org_type { get; set; }

        public string disctrict_name { get; set; }
        public string year { get; set; }
        public string month { get; set; }
        public string day { get; set; }
        public DateTime registration_date { get; set; }
    }

    public class ApplicationTask
    {
        public int id { get; set; }
        public string number { get; set; }
        public int task_id { get; set; }
        public string service_name { get; set; }
        public string status_name { get; set; }
        public string status_text_color { get; set; }
        public string status_back_color { get; set; }
        public DateTime registration_date { get; set; }
        public DateTime deadline { get; set; }
        public DateTime app_deadline { get; set; }
        public int? assignee_count { get; set; }
        public int? application_status_id { get; set; }
        public string? application_status_code { get; set; }
        public string? application_status_group_code { get; set; }
        public string application_status_color { get; set; }
    }

    public class ApplicationPaginationParameters
    {
        public int pageSize { get; set; } = 100;
        public int pageNumber { get; set; } = 0;
        public string sort_by { get; set; } = null;
        public string sort_type { get; set; } = null;
        public string pin { get; set; } = "";
        public string customerName { get; set; } = "";
        public DateTime? date_start { get; set; } = null;
        public DateTime? date_end { get; set; } = null;
        public int[] service_ids { get; set; } = Array.Empty<int>();
        public int[] status_ids { get; set; } = Array.Empty<int>();
        public string address { get; set; } = "";
        public int? district_id { get; set; } = 0;
        public int? deadline_day { get; set; } = 0;
        public string number { get; set; } = "";
        public int? tag_id { get; set; } = 0;
        public bool? isExpired { get; set; } = false;
        public int? employee_id { get; set; } = 0;
        public bool useCommon { get; set; } = true;
        public bool withoutAssignedEmployee { get; set; } = false;
        public bool isMyOrgApplication { get; set; } = false;
        public string common_filter { get; set; } = "";
        public int[] structure_ids { get; set; } = Array.Empty<int>();
        public bool? is_paid { get; set; }

    }

    public class ApplicationTotalSumData
    {
        public int id { get; set; }
        public decimal sum_wo_discount { get; set; }
        public decimal total_sum { get; set; }
        public decimal discount_percentage { get; set; }
        public decimal discount_value { get; set; }
        public decimal nds_value { get; set; }
        public decimal nsp_value { get; set; }
        public decimal nds_percentage { get; set; }
        public decimal nsp_percentage { get; set; }
        public bool has_discount { get; set; }
        public int calc_updated_by { get; set; }
        public int calc_created_by { get; set; }
        public DateTime? calc_created_at { get; set; }
        public DateTime? calc_updated_at { get; set; }
    }

    public class ReestrOtcheData
    {
        public List<Application> fiz_lico { get; set; }
        public List<Application> your_lico { get; set; }
    }

    public class SendCustomerNotification
    {
        public string[] smsNumbers { get; set; }
        public string[] telegramNumbers { get; set; }
        public string textSms { get; set; }
        public string textTelegram { get; set; }
        public int? application_id { get; set; }
        public int? customer_id { get; set; }
    }

    public class MyApplication
    {
        public int id { get; set; }
        public string number { get; set; }
        public string status { get; set; }
        public string full_name { get; set; }
        public string address { get; set; }
        public decimal total_sum { get; set; }
    }
}
