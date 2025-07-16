namespace Application.Exceptions
{
    public class PermissionException : Exception
    {
        public PermissionExceptionDetails Details {  get; private set; }
        public PermissionException(string message, PermissionExceptionDetails details, Exception? innerException)
            : base(message, innerException)
        {
            Details = details;
        }
    }

    public class PermissionExceptionDetails
    {
        public string Code { get; set; }
        public string Role { get; set; }
        //TODO add more fields
    }
}
