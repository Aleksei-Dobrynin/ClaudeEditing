using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
	public class application_payment
	{
		public int id { get; set; }
		public int application_id { get; set; }
		public string description { get; set; }
		public decimal? sum { get; set; }
		public decimal? sum_wo_discount { get; set; }
		public decimal? discount_percentage { get; set; }
		public decimal? discount_value { get; set; }
		public string? reason { get; set; }
		public File document { get; set; }
		public int? file_id { get; set; }
		public decimal? nds { get; set; }
		public decimal? nds_value { get; set; }
		public decimal? nsp { get; set; }
		public decimal? nsp_value { get; set; }
		public int? head_structure_id { get; set; }
		public int? implementer_id { get; set; }
		public int? structure_id { get; set; }
		public string structure_name { get; set; }
        public string? structure_short_name { get; set; }
        public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public string? created_by_name { get; set; }
		public int? updated_by { get; set; }
		public string? updated_by_name { get; set; }
		public string? current_user { get; set; }
        public string? application_number { get; set; }
        public string? file_name { get; set; }
        public string? head_structure_name { get; set; }
        public string? implementer_ids_name { get; set; }
        public string? sign_full_name { get; set; }
        public int? idTask { get; set; }
	}

	public class applacation_payment_sum
	{
        public int id { get; set; }
        public double? sum { get; set; }
		public string structure_name { get; set; }
    }
	
	public class SaveDiscountRequest
	{
		public int application_id { get; set; }
		public decimal sum_wo_discount { get; set; }
		public decimal nds_value { get; set; }
		public decimal nsp_value { get; set; }
		public decimal total_sum { get; set; }
		public decimal discount_percentage { get; set; }
		public decimal discount_value { get; set; }
		public decimal nds { get; set; }
		public decimal nsp { get; set; }
	}
	
	public class DeletePaymentRequest
	{
		public int id { get; set; }
		public string? reason { get; set; }
	}

    public class DashboardGetEmployeeCalculationsDto
    {
        public int row_id { get; set; }
        public int application_id { get; set; }
        public string number { get; set; }
        public decimal all_sum { get; set; }
        public decimal wo_nalog { get; set; }
        public decimal nalog { get; set; }
        public string customer { get; set; }
        public string address { get; set; }
        public string employee { get; set; }
        public string discount { get; set; }
    }
    public class DashboardGetEmployeeCalculationsGroupedDto
    {
        public int row_id { get; set; }
        public int app_count { get; set; }
        public decimal all_sum { get; set; }
        public decimal wo_nalog { get; set; }
        public decimal nalog { get; set; }
        public string employee { get; set; }
    }
}