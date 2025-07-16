using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateTechCouncilSessionRequest
    {
        public DateTime date { get; set; }
        public bool is_active { get; set; }
    }
    public class UpdateTechCouncilSessionRequest
    {
        public int id { get; set; }
        public DateTime date { get; set; }
        public bool is_active { get; set; }
    }
}