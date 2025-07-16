using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CustomSvgIcon : BaseLogDomain
    {
        public int id { get; set; }
        public string name { get; set; }
        public string svgPath { get; set; }
    }
}
