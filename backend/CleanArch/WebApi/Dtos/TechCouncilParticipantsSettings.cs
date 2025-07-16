using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateTechCouncilParticipantsSettingsRequest
    {
        public int structure_id { get; set; }
        public int service_id { get; set; }
        public bool is_active { get; set; }
    }
    public class UpdateTechCouncilParticipantsSettingsRequest
    {
        public int id { get; set; }
        public int structure_id { get; set; }
        public int service_id { get; set; }
        public bool is_active { get; set; }
    }
}