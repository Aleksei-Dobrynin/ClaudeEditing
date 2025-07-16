using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentResults;


namespace Domain
{
    //public enum ErrorType
    //{
    //    NOT_FOUND,
    //    VALIDATION,
    //    LOGIC,
    //    PERMISSION_ACCESS,
    //    ALREADY_UPDATED
    //}

    public enum ErrorType
    {
        VALIDATION,
        NOT_FOUND,
        LOGIC,
        PERMISSION_ACCESS,
        ALREADY_UPDATED,
        MESSAGE
    }

    public abstract class CustomError : Error
    {
        public ErrorType ErrorType { get; }
        public int StatusCode { get; }
        public object Parameters { get; }

        protected CustomError(string message, ErrorType errorType, int statusCode, object parameters = null) : base(message)
        {
            ErrorType = errorType;
            StatusCode = statusCode;
            Parameters = parameters;

            Metadata.Add("ErrorType", errorType.ToString());
            Metadata.Add("StatusCode", statusCode);
            Metadata.Add("Parameters", parameters);
        }
    }

    public class PermissionError : CustomError
    {
        public PermissionError(string message = "")
            : base(message, ErrorType.PERMISSION_ACCESS, 403) { }
    }

    public class LogicError : CustomError
    {
        public LogicError(string message = "", object parameters = null)
            : base(message, ErrorType.LOGIC, 422, parameters) { }
    }

    public class ValidationError : CustomError
    {
        public ValidationError(string message = "")
            : base(message, ErrorType.VALIDATION, 400) { }
    }

    public class AlreadyUpdatedError : CustomError
    {
        public AlreadyUpdatedError(string message = "")
            : base(message, ErrorType.ALREADY_UPDATED, 422) { }
    }

    public class NotFoundError : CustomError
    {
        public NotFoundError(string message = "")
            : base(message, ErrorType.NOT_FOUND, 404) { }
    }
}
