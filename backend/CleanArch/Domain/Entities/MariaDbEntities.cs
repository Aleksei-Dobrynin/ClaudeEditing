
using Newtonsoft.Json;
using System.Text.Json.Serialization;
using System.Xml.Linq;

namespace Domain.Entities
{
    public class StContsing
    {
        public string sid { get; set; }
        public long cdate { get; set; }
        public long csum { get; set; }

    }

    public class PaymentInReestr
    {
        public int id { get; set; }
        public int branch { get; set; }
        public int cid { get; set; }
        public int sid { get; set; }
        public string invoce { get; set; }
        public int amount { get; set; }

    }
    public class ReestrInApp
    {
        public int id { get; set; }
        public int sid { get; set; }
        public int otd { get; set; }
        public int sum { get; set; }

    }
    public class Reestr
    {
        public int id { get; set; }
        public int branch { get; set; }
        public int uid { get; set; }
        public int ymonth { get; set; }
        public string cname { get; set; }
        public int status { get; set; }
        public string comment { get; set; }

    }
    public class Statement
    {
        public int id { get; set; }
        public int branch { get; set; }
        public long inn { get; set; }
        public int step { get; set; }
        public int service { get; set; }
        public long started { get; set; }
        public long finished { get; set; }
        public int issue { get; set; }
        public int fact { get; set; }
        public int realize { get; set; }
        public int ticket { get; set; }
        public string sid { get; set; }
        public string workers { get; set; }
        public string person { get; set; }
        public string _object { get; set; }
        public int sms { get; set; }
        public string app_number { get; set; }

    }
    public class StatementJson
    {
        [JsonPropertyName("save")]
        public string Save { get; set; }

        [JsonPropertyName("redirect")]
        public string Redirect { get; set; }

        [JsonPropertyName("step")]
        public string Step { get; set; }

        [JsonPropertyName("service_days")]
        public string ServiceDays { get; set; }

        [JsonPropertyName("finished_old")]
        public string FinishedOld { get; set; }

        [JsonPropertyName("service")]
        public string Service { get; set; }

        [JsonPropertyName("started")]
        public string Started { get; set; }

        [JsonPropertyName("finished")]
        public string Finished { get; set; }

        [JsonPropertyName("o_name")]
        public string OName { get; set; }

        [JsonPropertyName("o_desc")]
        public string ODesc { get; set; }

        [JsonPropertyName("o_address")]
        public string OAddress { get; set; }

        [JsonPropertyName("district")]
        public string District { get; set; }

        [JsonPropertyName("inn")]
        public string Inn { get; set; }

        [JsonPropertyName("p_type")]
        public string PType { get; set; }

        [JsonPropertyName("p_surname")]
        public string PSurname { get; set; }

        [JsonPropertyName("p_name")]
        public string PName { get; set; }

        [JsonPropertyName("p_papi")]
        public string PPapi { get; set; }

        [JsonPropertyName("p_series")]
        public string PSeries { get; set; }

        [JsonPropertyName("p_mvd")]
        public string PMvd { get; set; }

        [JsonPropertyName("p_date")]
        public string PDate { get; set; }

        [JsonPropertyName("p_life")]
        public string PLife { get; set; }

        [JsonPropertyName("p_tel")]
        public string PTel { get; set; }

        [JsonPropertyName("proxy_name")]
        public string ProxyName { get; set; }

        [JsonPropertyName("proxy_number")]
        public string ProxyNumber { get; set; }

        [JsonPropertyName("proxy_date")]
        public string ProxyDate { get; set; }

        [JsonPropertyName("docs")]
        public List<string> Docs { get; set; }

        [JsonPropertyName("ext_docs_1")]
        public string ExtDocs1 { get; set; }

        [JsonPropertyName("ext_docs_2")]
        public string ExtDocs2 { get; set; }

        [JsonPropertyName("ext_docs_3")]
        public string ExtDocs3 { get; set; }

        [JsonPropertyName("com_name")]
        public string com_name { get; set; }       
        [JsonPropertyName("com_address")]
        public string com_address { get; set; }     
        [JsonPropertyName("com_regs")]
        public string com_regs { get; set; }        
        [JsonPropertyName("com_tel")]
        public string com_tel { get; set; }        
        [JsonPropertyName("com_mail")]
        public string com_mail { get; set; }        
        [JsonPropertyName("com_ruks")]
        public string com_ruks { get; set; }   
        [JsonPropertyName("com_ugns")]
        public string com_ugns { get; set; }       
        [JsonPropertyName("com_rs")]
        public string com_rs { get; set; }    
        [JsonPropertyName("com_bank")]
        public string com_bank { get; set; }      
        [JsonPropertyName("com_bik")]
        public string com_bik { get; set; }



    }

    public class UserMariaDb
    {
        public int id { get; set; }
        public int branch { get; set; }
        public string email { get; set; }
        public string pass { get; set; }
        public string surname { get; set; }
        public string name { get; set; }
        public string papi { get; set; }
        public string tel { get; set; }
        public int state { get; set; }
        public int role{ get; set; }
        public int otdel{ get; set; }
        public int u_create { get; set; }
        public int u_update { get; set; }
        public int ecp { get; set; }
        public int twitt { get; set; }


    }

}
