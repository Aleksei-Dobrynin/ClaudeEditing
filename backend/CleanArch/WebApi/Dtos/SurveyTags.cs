using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateSurveyTagsRequest
    {
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }

        public int? queueNumber { get; set; }
        public string iconColor { get; set; }
        public int? idCustomSvgIcon { get; set; }
    }

    public class UpdateSurveyTagsRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }

        public int? queueNumber { get; set; }
        public string iconColor { get; set; }
        public int? idCustomSvgIcon { get; set; }
    }
}
