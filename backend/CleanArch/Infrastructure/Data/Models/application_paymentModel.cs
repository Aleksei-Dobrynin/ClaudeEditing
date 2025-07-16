using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class application_paymentModel : BaseLogDomain
    {
        public int id { get; set; }
		public int application_id { get; set; }
		public string description { get; set; }
		public decimal? sum { get; set; }
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
		public int? structure_id { get; set; }
    }
}