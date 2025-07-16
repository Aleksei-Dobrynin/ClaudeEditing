using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Validation
    {
        public bool IsValid { get; set; }
        public List<FieldError> FieldErrors { get; set; }
        

        public static Validation Valid() => new Validation
        {
            IsValid = true,
        };

        public static Validation NotValid(List<FieldError> fieldErrors) => new Validation
        {
            IsValid = false,
            FieldErrors = fieldErrors
        };
    }


}
