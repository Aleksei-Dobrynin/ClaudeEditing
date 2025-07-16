using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreatereleaseRequest
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
        public List<FileModel?>? files { get; set; }

    }
    public class UpdatereleaseRequest
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
        public List<FileModel?>? files { get; set; }
		public string? video_ids { get; set; }

    }
}