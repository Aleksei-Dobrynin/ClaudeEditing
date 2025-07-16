using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createcontragent_interaction_docRequest
    {
        public int id { get; set; }
		public int file_id { get; set; }
		public int interaction_id { get; set; }
        public FileModel? document { get; set; }
        public string? message { get; set; }
        public bool? is_portal { get; set; }
        public bool? for_customer { get; set; }

    }
    public class Updatecontragent_interaction_docRequest
    {
        public int id { get; set; }
		public int file_id { get; set; }
		public int interaction_id { get; set; }
		
    }
}