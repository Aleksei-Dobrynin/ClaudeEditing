using System;

namespace Domain.Entities
{
    public class SecurityEvent : BaseLogDomain
    {
        public int id { get; set; }
        public string event_type { get; set; } // LOGIN_ATTEMPT, ACCESS_DENIED, DATA_CHANGE, etc.
        public string event_description { get; set; }
        public string user_id { get; set; }
        public string ip_address { get; set; }
        public string user_agent { get; set; }
        public DateTime event_time { get; set; }
        public int? severity_level { get; set; } // 1-Critical, 2-High, 3-Medium, 4-Low
        public bool is_resolved { get; set; }
        public DateTime? resolution_time { get; set; }
        public string? resolution_notes { get; set; }
    }

    public static class SecurityEventType
    {
        public const string LOGIN_SUCCESS = "LOGIN_SUCCESS";
        public const string LOGIN_FAILURE = "LOGIN_FAILURE";
        public const string ACCESS_DENIED = "ACCESS_DENIED";
        public const string PERMISSION_CHANGE = "PERMISSION_CHANGE";
        public const string PASSWORD_CHANGE = "PASSWORD_CHANGE";
        public const string PASSWORD_RESET = "PASSWORD_RESET";
        public const string USER_CREATED = "USER_CREATED";
        public const string USER_DELETED = "USER_DELETED";
        public const string USER_BLOCKED = "USER_BLOCKED";
        public const string DATA_EXPORT = "DATA_EXPORT";
        public const string SENSITIVE_DATA_ACCESS = "SENSITIVE_DATA_ACCESS";
        public const string UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"; // 401
        public const string VALIDATION_ERROR = "VALIDATION_ERROR"; // 422
    }
}