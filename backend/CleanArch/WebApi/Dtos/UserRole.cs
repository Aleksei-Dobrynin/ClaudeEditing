using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateUserRoleRequest
    {
        public int role_id { get; set; }
        public int structure_id { get; set; }
        public int user_id { get; set; }
    }

    public class UpdateUserRoleRequest
    {
        public int id { get; set; }
        public int role_id { get; set; }
        public int structure_id { get; set; }
        public int user_id { get; set; }
    }
}
