using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
	public class Createapplication_paid_invoiceRequest
    {
        public int id { get; set; }
        public DateTime? date { get; set; }
        public string payment_identifier { get; set; }
        public decimal sum { get; set; }
        public string bank_identifier { get; set; }
        public int application_id { get; set; }
        public string? tax { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public bool? mbank { get; set; }
        public string? number { get; set; }
    }
	public class Updateapplication_paid_invoiceRequest
    {
        public int id { get; set; }
        public DateTime? date { get; set; }
        public string payment_identifier { get; set; }
        public decimal sum { get; set; }
        public string bank_identifier { get; set; }
        public int application_id { get; set; }
        public string? tax { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }

    }
}