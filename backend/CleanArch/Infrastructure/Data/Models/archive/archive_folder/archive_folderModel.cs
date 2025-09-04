using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class archive_folderModel: BaseLogDomain
    {
        public int id { get; set; }
		public string archive_folder_name { get; set; }
		public int? dutyplan_object_id { get; set; }
		public string folder_location { get; set; }
		
    }
}