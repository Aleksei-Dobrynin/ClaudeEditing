namespace WebApi.Dtos
{
    public class CreateStepStatusLogRequest
    {
        public int? app_step_id { get; set; }
        public string old_status { get; set; }
        public string new_status { get; set; }
        public DateTime? change_date { get; set; }
        public string comments { get; set; }
        //public DateTime? created_at { get; set; }
        //public DateTime? updated_at { get; set; }
        //public int? created_by { get; set; }
        //public int? updated_by { get; set; }
    }

    public class UpdateStepStatusLogRequest
    {
        public int id { get; set; }
        public int? app_step_id { get; set; }
        public string old_status { get; set; }
        public string new_status { get; set; }
        public DateTime? change_date { get; set; }
        public string comments { get; set; }
        //public DateTime? created_at { get; set; }
        //public DateTime? updated_at { get; set; }
        //public int? created_by { get; set; }
        //public int? updated_by { get; set; }
    }
}