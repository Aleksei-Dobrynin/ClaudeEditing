using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class architecture_process
    {
        public int id { get; set; }
		public int? status_id { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
        public string app_number { get; set; }
        public int? archirecture_process_status_id { get; set; }
        public string archirecture_process_status_code { get; set; }
        public string archirecture_process_status_name { get; set; }
        public string archirecture_process_status_text_color { get; set; }
        public string archirecture_process_status_back_color { get; set; }
        public int arch_object_id { get; set; }
        public string arch_object_number { get; set; }
        public string arch_object_address { get; set; }

    }
}