using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateRoleRequest
    {
        public string name { get; set; }
        public string code { get; set; }
    }

    public class UpdateRoleRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string code { get; set; }
    }
}
