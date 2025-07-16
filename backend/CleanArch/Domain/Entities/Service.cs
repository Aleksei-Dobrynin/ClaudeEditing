using System.Xml.Linq;

namespace Domain.Entities
{
    public class Service : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? name_kg { get; set; }
        public string? name_long { get; set; }
        public string? name_long_kg { get; set; }
        public string? name_statement { get; set; }
        public string? name_statement_kg { get; set; }
        public string? name_confirmation { get; set; }
        public string? name_confirmation_kg { get; set; }
        public string? description_kg { get; set; }

        // Новые поля из структуры таблицы
        public string? text_color { get; set; }
        public string? background_color { get; set; }

        public string? short_name { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public int? day_count { get; set; }
        public int? workflow_id { get; set; }
        public int? law_document_id { get; set; }
        public string? law_document_name { get; set; }
        public decimal? price { get; set; }
        public string? workflow_name { get; set; }
        public bool? is_active { get; set; }
        public DateTime? date_start { get; set; }
        public DateTime? date_end { get; set; }
        public int? structure_id { get; set; }
        public string? structure_name { get; set; }
    }
    public class ResultDashboard
    {
        public List<long> counts { get; set; }
        public List<string> names { get; set; }
    }
    public class ChartTableDataDashboard
    {
        public string register { get; set; }
        public int employee_id { get; set; }
        public int count { get; set; }
    }   
    
    public class ChartTableDataDashboardStructure
    {
        public string structure { get; set; }
        public string employee { get; set; }
        public int structure_id { get; set; }
        public int employee_id { get; set; }
        public int count { get; set; }
        public int days3 { get; set; }
        public int days7 { get; set; }
        public int days_more { get; set; }
    }
    public class AppCountDashboradData
    {
        public int all_count { get; set; }
        public int tech_accepted_count { get; set; }
        public int tech_declined_count { get; set; }
        public int done_count { get; set; }
        public int at_work_count { get; set; }
    }
}
