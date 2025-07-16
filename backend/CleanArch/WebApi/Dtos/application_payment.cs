using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
	public class Createapplication_paymentRequest
	{
		public int id { get; set; }
		public int application_id { get; set; }
		public string? description { get; set; }
		public decimal? sum { get; set; }
		public int? structure_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public string? current_user { get; set; }
		public decimal? sum_wo_discount { get; set; }
		public decimal? discount_percentage { get; set; }
		public decimal? discount_value { get; set; }
		public string? reason { get; set; }
		public int? file_id { get; set; }
		public decimal? nds { get; set; }
		public decimal? nds_value { get; set; }
		public decimal? nsp { get; set; }
		public decimal? nsp_value { get; set; }
		public int? head_structure_id { get; set; }
		public int? implementer_id { get; set; }
		public FileModel? document { get; set; }
		public int? idTask { get; set; }
	}
	public class Updateapplication_paymentRequest
	{
		public int id { get; set; }
		public int application_id { get; set; }
		public string? description { get; set; }
		public decimal? sum { get; set; }
		public int? structure_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		public string? current_user { get; set; }
		public decimal? sum_wo_discount { get; set; }
		public decimal? discount_percentage { get; set; }
		public decimal? discount_value { get; set; }
		public string? reason { get; set; }
		public int? file_id { get; set; }
		public decimal? nds { get; set; }
		public decimal? nds_value { get; set; }
		public decimal? nsp { get; set; }
		public decimal? nsp_value { get; set; }
		public int? head_structure_id { get; set; }
		public int? implementer_id { get; set; }
		public FileModel? document { get; set; }
		public int? idTask { get; set; }
	}

	public class GetSumRequest
	{
		public DateTime dateStart { get; set; }
		public DateTime dateEnd { get; set; }
		public List<int> structures_id { get; set; }

    }
}