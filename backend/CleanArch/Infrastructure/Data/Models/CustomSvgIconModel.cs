using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain;

namespace Infrastructure.Data.Models
{
    internal class CustomSvgIconModel : BaseLogDomain
    {
        public int id { get; set; }
        public string name { get; set; }
        public string svgPath { get; set; }
    }
}
