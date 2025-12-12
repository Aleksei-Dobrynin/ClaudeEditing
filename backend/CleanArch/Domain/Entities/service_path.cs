using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class service_path
    {
        public int id { get; set; }
        public int? updated_by { get; set; }
        public int? service_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool? is_default { get; set; }
        public bool? is_active { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }

        // Дополнительные поля из JOIN'ов (не сохраняются в БД)
        public string service_name { get; set; }
        public int? steps_count { get; set; }
    }
}