namespace WebApi.Dtos
{
    public class CreateStepRequiredCalcRequest
    {
        public int step_id { get; set; }
        public int structure_id { get; set; }
    }

    public class UpdateStepRequiredCalcRequest
    {
        public int id { get; set; }
        public int step_id { get; set; }
        public int structure_id { get; set; }
    }
}