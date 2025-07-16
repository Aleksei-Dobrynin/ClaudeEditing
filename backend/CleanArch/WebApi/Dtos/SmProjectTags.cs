using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateSmProjectTagsRequest
    {
        public int project_id { get; set; }
        public int tag_id { get; set; }

    }

    public class UpdateSmProjectTagsRequest
    {
        public int id { get; set; }
        public int project_id { get; set; }
        public int tag_id { get; set; }

    }
}
