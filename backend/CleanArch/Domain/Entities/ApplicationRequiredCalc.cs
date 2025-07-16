namespace Domain.Entities
{
    public class ApplicationRequiredCalc : BaseLogDomain
    {
       public int id { get; set; }
       public int application_id { get; set; }
       public string application_number { get; set; }
       public int application_step_id { get; set; }
       public string path_step_name { get; set; }
       public int? structure_id { get; set; }
       public string structure_name { get; set; }
    }
}