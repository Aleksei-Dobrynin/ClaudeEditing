using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateArchiveObjectRequest
    {
        public string? doc_number { get; set; }
        public string? address { get; set; }
        public string? customer { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string? layer { get; set; }
        public string? description { get; set; }
        public DateTime? date_setplan { get; set; }
        public int? quantity_folder { get; set; }
        public int? status_dutyplan_object_id { get; set; }
        public int? parent_id { get; set; }
        public List<Updatecustomers_for_archive_objectRequest>? customers_for_archive_object { get; set; }
    }

    public class UpdateArchiveObjectRequest
    {
        public int id { get; set; }
        public string? doc_number { get; set; }
        public string? address { get; set; }
        public string? customer { get; set; }
        public double? latitude { get; set; }
        public double? longitude { get; set; }
        public string? layer { get; set; }
        public string? description { get; set; }
        public DateTime? date_setplan { get; set; }
        public int? quantity_folder { get; set; }
        public int? status_dutyplan_object_id { get; set; }
        public int? parent_id { get; set; }
        public List<Updatecustomers_for_archive_objectRequest> customers_for_archive_object { get; set; }
    }
}
