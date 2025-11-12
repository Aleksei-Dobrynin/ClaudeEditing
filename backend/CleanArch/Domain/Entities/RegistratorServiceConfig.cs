using System;

namespace Domain.Entities
{
    /// <summary>
    /// Настройки услуг для регистратора
    /// </summary>
    public class RegistratorServiceConfig : BaseLogDomain
    {
        public int id { get; set; }
        public int employee_id { get; set; }
        public int service_id { get; set; }

        // Дополнительные поля из JOIN (для отображения)
        public string? service_name { get; set; }
        public string? service_code { get; set; }
        public string? employee_full_name { get; set; }
    }
}