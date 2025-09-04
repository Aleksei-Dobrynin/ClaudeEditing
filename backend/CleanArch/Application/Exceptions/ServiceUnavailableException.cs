using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class ServiceUnavailableException : Exception
    {
        public string ServiceName { get; set; }
        public bool IsTimeout { get; set; }

        public ServiceUnavailableException(string message) : base(message)
        {
        }

        public ServiceUnavailableException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public ServiceUnavailableException(string message, string serviceName, bool isTimeout = false)
            : base(message)
        {
            ServiceName = serviceName;
            IsTimeout = isTimeout;
        }
    }
}
