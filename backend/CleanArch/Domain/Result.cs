using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    //public class Result<T>
    //{
    //    public bool IsSuccess { get; set; }
    //    public T Value { get; set; }
    //    public object ErrorObject { get; set; }
    //    public string ErrorMessage { get; set; }
    //    public string ErrorType { get; set; }
    //    public List<FieldError> FieldErrors { get; set; }



    //    public static Result<T> Success(T value) => new Result<T>
    //    {
    //        IsSuccess = true,
    //        Value = value
    //    };

    //    public static Result<T> Failure(object value, string type, List<FieldError> fieldErrors) => new Result<T>
    //    {
    //        IsSuccess = false,
    //        ErrorType = type,
    //        ErrorObject = value,
    //        FieldErrors = fieldErrors
    //    };

    //    public static Result<T> Error(object value, string type, string message) => new Result<T>
    //    {
    //        IsSuccess = false,
    //        ErrorType = type,
    //        ErrorMessage = message,
    //        ErrorObject = value,
    //    };
    //}

    public class FieldError
    {
        public string FieldName { get; set; }
        public string ErrorCode { get; set; }
    }

}
