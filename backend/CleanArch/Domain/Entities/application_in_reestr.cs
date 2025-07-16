using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class application_in_reestr
    {
        public int id { get; set; }
        public int reestr_id { get; set; }
        public string reestr_name { get; set; }
        public string reestr_status_code { get; set; }
        public string reestr_status_name { get; set; }
        public int application_id { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }

    }
    public class ReestrOtchetApplicationData
    {
        public int id { get; set; }
        public string number { get; set; }
        public decimal old_sum { get; set; }
        public string status_code { get; set; }
        public int index { get; set; }
        public string customer { get; set; }
        public string arch_object { get; set; }
        public string number_kvitancii { get; set; }
        public decimal sum { get; set; }
        public bool is_organization { get; set; }
        public decimal sum_oplata { get; set; }
        public decimal total_sum { get; set; }
        public decimal discount_percentage { get; set; }
        public decimal discount_value { get; set; }
        public List<ReestrOtchetOtdelData> otdel_calcs{ get; set; }

    }
    public class ReestrOtchetOtdelData
    {
        public int otdel_id { get; set; }
        public decimal sum { get; set; }
    }
    public class ReestrOtchetData
    {
        public reestr reestr { get; set; }
        public List<ReestrOtchetApplicationData> fiz_lica { get; set; }
        public List<ReestrOtchetApplicationData> your_lica { get; set; }
        public decimal fiz_summa { get; set; }
        public decimal your_summa { get; set; }
        public decimal all_summa { get; set; }
        public List<OrgStructure> structures { get; set; }

    }

    public class TaxOtchetData
    {
        public decimal fiz_summa { get; set; }
        public decimal your_summa { get; set; }
        public decimal all_summa { get; set; }
        public string tax_name { get; set; }

    }
}