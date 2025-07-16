using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateArchObjectRequest : BaseLogDomain
    {
        public string? address { get; set; }
        public string? name { get; set; }
        public string? identifier { get; set; }
        public int? district_id { get; set; }
        public string? description { get; set; }
        public int[] tags { get; set; }
        public double? xcoordinate { get; set; }
        public double? ycoordinate { get; set; }
    }

    public class UpdateArchObjectRequest
    {
        public int id { get; set; }
        public string? address { get; set; }
        public string? name { get; set; }
        public string? identifier { get; set; }
        public int? district_id { get; set; }
        public string? description { get; set; }
        public int[] tags { get; set; }
        public double? xcoordinate { get; set; }
        public double? ycoordinate { get; set; }

    }
}
