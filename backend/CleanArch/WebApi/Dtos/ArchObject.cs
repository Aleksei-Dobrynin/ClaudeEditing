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
        public int? tunduk_district_id { get; set; }
        public int? tunduk_addres_unit_id { get; set; }
        public int? tunduk_street_id { get; set; }
        public string? tunduk_bulding_num { get; set; }
        public string? tunduk_flat_num { get; set; }
        public string? tunduk_uch_num { get; set; }
        public bool? is_manual { get; set; }
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
        public int? tunduk_district_id { get; set; }
        public int? tunduk_address_unit_id { get; set; }
        public int? tunduk_street_id { get; set; }
        public string? tunduk_building_num { get; set; }
        public string? tunduk_flat_num { get; set; }
        public string? tunduk_uch_num { get; set; }
        public bool? is_manual { get; set; }

    }
}
