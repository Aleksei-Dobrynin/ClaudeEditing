using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Models
{
    public class telegram_questionsModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public int idSubject { get; set; }
        public string answer { get; set; }
        public string answer_kg { get; set; }
        public string name_kg { get; set; }
    }
}
