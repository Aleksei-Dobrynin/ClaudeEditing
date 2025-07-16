using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class release
    {
        public int id { get; set; }
		public int? updated_by { get; set; }
		public string number { get; set; }
		public string? description { get; set; }
		public string? description_kg { get; set; }
		public string? code { get; set; }
		public DateTime? date_start { get; set; }
		public DateTime? created_at { get; set; }
		public DateTime? updated_at { get; set; }
		public int? created_by { get; set; }
		public List<release_video> videos { get; set; }
        public List<File> files { get; set; }
        public string? video_ids { get; set; }

    }
}