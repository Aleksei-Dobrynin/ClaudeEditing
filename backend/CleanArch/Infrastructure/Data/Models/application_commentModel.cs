using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    public class application_commentModel : BaseLogDomain
    {
        public int id { get; set; }
        public int? application_id { get; set; }
        public string? comment { get; set; }
    }
}
