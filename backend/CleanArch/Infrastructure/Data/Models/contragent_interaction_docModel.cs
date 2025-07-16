using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class contragent_interaction_docModel : BaseLogDomain
    {
        public int id { get; set; }
		public int? file_id { get; set; }
		public int interaction_id { get; set; }
        public int? user_id { get; set; }
        public string? type_org { get; set; }
        public string? message { get; set; }
        public bool? for_customer { get; set; }
    }
}