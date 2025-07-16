using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class contragent_interaction_doc : BaseLogDomain
    {
        public int id { get; set; }
		public int? file_id { get; set; }
		public int interaction_id { get; set; }
        public File document { get; set; }
        public string file_name { get; set; }
        public int? user_id { get; set; }
        public string? user_name { get; set; }
        public string? type_org { get; set; }
        public string? message { get; set; }
        public DateTime sent_at { get; set; }
        public bool? is_portal { get; set; }
        public bool? for_customer { get; set; }
    }
}