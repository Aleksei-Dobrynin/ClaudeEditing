namespace WebApi.Dtos
{
    public class CreateApplicationRequiredCalcRequest
    {
        public int application_id { get; set; }
        public int application_step_id { get; set; }
        public int structure_id { get; set; }
    }

    public class UpdateApplicationRequiredCalcRequest
    {
        public int id { get; set; }
        public int application_id { get; set; }
        public int application_step_id { get; set; }
        public int structure_id { get; set; }
    }
}