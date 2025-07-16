using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class n8nResponse
    {
        public bool? valid { get; set; }
        public ErrorDetails error { get; set; }
    }

    public class ErrorDetails
    {
        public string ru { get; set; }
        public string kg { get; set; }
    }
    
    public class ValidationResult
    {
        public bool? valid { get; set; }
        public ErrorDetails error { get; set; }
    }
}
