using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class Createtask_statusRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
		public string backcolor { get; set; }
		public string textcolor { get; set; }

    }
    public class Updatetask_statusRequest
    {
        public int id { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string code { get; set; }
        public string backcolor { get; set; }
        public string textcolor { get; set; }

    }
}