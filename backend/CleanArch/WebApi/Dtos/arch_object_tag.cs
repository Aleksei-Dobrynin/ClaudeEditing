using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createarch_object_tagRequest
    {
        public int id { get; set; }
        public int id_object { get; set; }
        public int id_tag { get; set; }

    }
    public class Updatearch_object_tagRequest
    {
        public int id { get; set; }
        public int id_object { get; set; }
        public int id_tag { get; set; }

    }
    public class UpdateTagsRequest
    {
        public int[] tags { get; set; }
        public int application_id { get; set; }

    }
}