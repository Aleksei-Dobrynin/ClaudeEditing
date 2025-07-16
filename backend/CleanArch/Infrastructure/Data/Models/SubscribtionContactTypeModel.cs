using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    internal class SubscribtionContactTypeModel
    {
        public int id { get; set; }
        public int[] idTypeContact { get; set; }
        public int idSubscribtion { get; set; }
    }
}
