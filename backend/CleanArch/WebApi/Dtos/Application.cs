
using Domain.Entities;

namespace WebApi.Dtos
{
    public class CreateApplicationRequest
    {
        public DateTime? registration_date { get; set; }
        public int customer_id { get; set; }
        public int status_id { get; set; }
        public int workflow_id { get; set; }
        public int service_id { get; set; }
        public int? workflow_task_structure_id { get; set; }
        public DateTime? deadline { get; set; }
        public int? arch_object_id { get; set; }
        public DateTime? updated_at { get; set; }
        public string? work_description { get; set; }
        public int? object_tag_id { get; set; }
        public CreateCustomerRequest customer { get; set; }
        public List<UpdateArchObjectRequest> archObjects { get; set; }
        public string? incoming_numbers { get; set; }
        public string? outgoing_numbers { get; set; }
        public bool? saveWithoutCheck { get; set; }
    }

    public class UpdateApplicationRequest
    {
        public int id { get; set; }
        public DateTime? registration_date { get; set; }
        public int customer_id { get; set; }
        public int status_id { get; set; }
        public int workflow_id { get; set; }
        public int service_id { get; set; }
        public DateTime? deadline { get; set; }
        public int? arch_object_id { get; set; }
        public DateTime? updated_at { get; set; }
        public string? work_description { get; set; }
        public int? object_tag_id { get; set; }
        public CreateCustomerRequest customer { get; set; }
        public List<UpdateArchObjectRequest> archObjects { get; set; }
        public string? incoming_numbers { get; set; }
        public string? outgoing_numbers { get; set; }
    }
}
