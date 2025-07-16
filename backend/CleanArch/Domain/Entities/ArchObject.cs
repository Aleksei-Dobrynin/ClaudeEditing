
namespace Domain.Entities
{
    public class ArchObject : BaseLogDomain
    {
        public int id { get; set; }
        public string? address { get; set; }
        public string? name { get; set; }
        public string? identifier { get; set; }
        public int? district_id { get; set; }
        public string district_name { get; set; }
        public string? description { get; set; }
        public int[] tags { get; set; }
        public double? xcoordinate { get; set; }
        public double? ycoordinate { get; set; }
        public int[] tag_ids { get; set; }
        public string tag_names { get; set; }

    }
    public class ArchObjectLeaflet
    {
        public int app_id { get; set; }
        public double xcoordinate { get; set; }
        public double ycoordinate { get; set; }
        public string service_name { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public string work_description { get; set; }
        public string description { get; set; }
        public string customer { get; set; }
        public string number { get; set; }
        public string tags { get; set; }
        public string status { get; set; }
        public DateTime registration_date { get; set; }
    }
    public class UpdateCoordsObjRequest
    {
        public int application_id { get; set; }
        public double xcoord { get; set; }
        public double ycoord { get; set; }
    }
}
