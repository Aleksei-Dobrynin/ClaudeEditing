using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class archive_folderModel
    {
        public int id { get; set; }
		public string archive_folder_name { get; set; }
		public int? dutyplan_object_id { get; set; }
		public string folder_location { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public int? updated_by { get; set; }
		
    }
}