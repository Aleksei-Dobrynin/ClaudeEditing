namespace Domain.Entities
{
    public class StepRequiredCalc : BaseLogDomain
    {
       public int id { get; set; }
       public int step_id { get; set; }
       public string step_name { get; set; }
       public int structure_id { get; set; }
       public string structure_name { get; set; }
    }
}