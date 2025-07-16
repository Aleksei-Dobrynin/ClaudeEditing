using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class SubscribtionContactType
    {
        public int id { get; set; }
        public int[] idTypeContact { get; set; }
        public int idSubscribtion { get; set; }
    }
}
