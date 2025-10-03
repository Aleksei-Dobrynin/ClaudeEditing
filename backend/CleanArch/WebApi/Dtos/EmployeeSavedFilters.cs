namespace WebApi.Dtos
{
    public class CreateEmployeeSavedFiltersRequest
    {
        //public int employee_id { get; set; }
        public string filter_name { get; set; }
        public bool? is_default { get; set; }
        public bool? is_active { get; set; }

        public int? page_size { get; set; }
        public int? page_number { get; set; }
        public string? sort_by { get; set; }
        public string? sort_type { get; set; }

        public string pin { get; set; }
        public string customer_name { get; set; }
        public string common_filter { get; set; }
        public string address { get; set; }
        public string number { get; set; }
        public string incoming_numbers { get; set; }
        public string outgoing_numbers { get; set; }

        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public DateTime? dashboard_date_start { get; set; }
        public DateTime? dashboard_date_end { get; set; }

        public string service_ids { get; set; }
        public string status_ids { get; set; }
        public string structure_ids { get; set; }
        public string app_ids { get; set; }

        public int? district_id { get; set; }
        public int? tag_id { get; set; }
        public int? filter_employee_id { get; set; }
        public int? journals_id { get; set; }
        public int? employee_arch_id { get; set; }
        public int? issued_employee_id { get; set; }

        public int? tunduk_district_id { get; set; }
        public int? tunduk_address_unit_id { get; set; }
        public int? tunduk_street_id { get; set; }

        public int? deadline_day { get; set; }
        public decimal? total_sum_from { get; set; }
        public decimal? total_sum_to { get; set; }
        public decimal? total_payed_from { get; set; }
        public decimal? total_payed_to { get; set; }

        public bool? is_expired { get; set; }
        public bool? is_my_org_application { get; set; }
        public bool? without_assigned_employee { get; set; }
        public bool? use_common { get; set; }
        public bool? only_count { get; set; }
        public bool? is_journal { get; set; }
        public bool? is_paid { get; set; }

        public DateTime? last_used_at { get; set; }
        public int? usage_count { get; set; }
    }

    public class UpdateEmployeeSavedFiltersRequest
    {
        public int id { get; set; }
        //public int employee_id { get; set; }
        public string filter_name { get; set; }
        public bool? is_default { get; set; }
        public bool? is_active { get; set; }

        public int? page_size { get; set; }
        public int? page_number { get; set; }
        public string? sort_by { get; set; }
        public string? sort_type { get; set; }

        public string pin { get; set; }
        public string customer_name { get; set; }
        public string common_filter { get; set; }
        public string address { get; set; }
        public string number { get; set; }
        public string incoming_numbers { get; set; }
        public string outgoing_numbers { get; set; }

        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public DateTime? dashboard_date_start { get; set; }
        public DateTime? dashboard_date_end { get; set; }

        public string service_ids { get; set; }
        public string status_ids { get; set; }
        public string structure_ids { get; set; }
        public string app_ids { get; set; }

        public int? district_id { get; set; }
        public int? tag_id { get; set; }
        public int? filter_employee_id { get; set; }
        public int? journals_id { get; set; }
        public int? employee_arch_id { get; set; }
        public int? issued_employee_id { get; set; }

        public int? tunduk_district_id { get; set; }
        public int? tunduk_address_unit_id { get; set; }
        public int? tunduk_street_id { get; set; }

        public int? deadline_day { get; set; }
        public decimal? total_sum_from { get; set; }
        public decimal? total_sum_to { get; set; }
        public decimal? total_payed_from { get; set; }
        public decimal? total_payed_to { get; set; }

        public bool? is_expired { get; set; }
        public bool? is_my_org_application { get; set; }
        public bool? without_assigned_employee { get; set; }
        public bool? use_common { get; set; }
        public bool? only_count { get; set; }
        public bool? is_journal { get; set; }
        public bool? is_paid { get; set; }

        public DateTime? last_used_at { get; set; }
        public int? usage_count { get; set; }
    }
}