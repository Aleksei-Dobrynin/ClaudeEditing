namespace WebApi.Dtos
{
    public class CreateArchiveObjectCustomerRequest
    {
        public int archive_object_id { get; set; }
        public int customer_id { get; set; }
        public string description { get; set; }
    }

    public class UpdateArchiveObjectCustomerRequest
    {
        public int id { get; set; }
        public int archive_object_id { get; set; }
        public int customer_id { get; set; }
        public string description { get; set; }
    }
}
