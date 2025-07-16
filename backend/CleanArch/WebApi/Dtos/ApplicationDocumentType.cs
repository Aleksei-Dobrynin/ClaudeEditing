using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateApplicationDocumentTypeRequest
    {
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }

    }

    public class UpdateApplicationDocumentTypeRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }

    }
}
