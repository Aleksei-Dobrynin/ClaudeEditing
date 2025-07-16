using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createlegal_record_registryRequest
    {
        public int id { get; set; }
		public bool? is_active { get; set; }
		public string? defendant { get; set; }
		public int id_status { get; set; }
		public string? subject { get; set; }
		public string? complainant { get; set; }
		public string? decision { get; set; }
		public string? addition { get; set; }
        public List<int>? legalObjects { get; set; }
        public List<int>? assignees { get; set; }

        //public DateTime? created_at { get; set; }
        //public DateTime? updated_at { get; set; }
        //public int? created_by { get; set; }
        //public int? updated_by { get; set; }

    }
    public class Updatelegal_record_registryRequest
    {
        public int id { get; set; }
		public bool? is_active { get; set; }
		public string? defendant { get; set; }
		public int id_status { get; set; }
		public string? subject { get; set; }
		public string? complainant { get; set; }
		public string? decision { get; set; }
		public string? addition { get; set; }
        public List<int>? legalObjects { get; set; }
        public List<int>? assignees { get; set; }
        //public DateTime? created_at { get; set; }
        //public DateTime? updated_at { get; set; }
        //public int? created_by { get; set; }
        //public int? updated_by { get; set; }

    }
}