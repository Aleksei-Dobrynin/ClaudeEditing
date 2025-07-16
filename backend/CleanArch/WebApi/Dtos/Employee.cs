using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateEmployeeRequest
    {
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public string? pin { get; set; }
        public string? remote_id { get; set; }
        public string? user_id { get; set; }
        public string? email { get; set; }
        public string? telegram { get; set; }
    }

    public class UpdateEmployeeRequest
    {
        public int id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public string? pin { get; set; }
        public string? remote_id { get; set; }
        public string? user_id { get; set; }
        public string? email { get; set; }
        public string? telegram { get; set; }
    }

    public class UpdateInitialsEmployeeRequest  
    {
        public int id { get; set; }
        public string? last_name { get; set; }
        public string? first_name { get; set; }
        public string? second_name { get; set; }
        public string? pin { get; set; }
    }
}