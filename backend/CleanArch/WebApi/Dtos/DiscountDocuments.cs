using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateDiscountDocumentsRequest
    {
        public int file_id { get; set; }
        public string description { get; set; }
        public double discount { get; set; }
        public int discount_type_id { get; set; }
        public int document_type_id { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public FileModel? document { get; set; }
    }

    public class UpdateDiscountDocumentsRequest
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public string description { get; set; }
        public double discount { get; set; }
        public int discount_type_id { get; set; }
        public int document_type_id { get; set; }
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public FileModel? document { get; set; }
    }
}
