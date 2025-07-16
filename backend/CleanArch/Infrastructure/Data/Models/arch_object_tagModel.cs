using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class arch_object_tagModel : BaseLogDomain
    {
        public int id { get; set; }
        public int? id_object { get; set; }
        public int? id_tag { get; set; }
        public string? id_tag_name { get; set; }
        public string? id_object_name { get; set; }

    }
}