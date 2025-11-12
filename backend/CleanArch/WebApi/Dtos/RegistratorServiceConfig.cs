using System;
using System.Collections.Generic;

namespace WebApi.Dtos
{
    /// <summary>
    /// Запрос на добавление услуги для регистратора
    /// </summary>
    public class AddRegistratorServiceRequest
    {
        public int service_id { get; set; }
    }

    /// <summary>
    /// Запрос на массовое обновление услуг регистратора
    /// </summary>
    public class UpdateRegistratorServicesRequest
    {
        public int[]? service_ids { get; set; }
    }

    /// <summary>
    /// Ответ со списком услуг регистратора
    /// </summary>
    public class RegistratorServiceResponse
    {
        public int id { get; set; }
        public int employee_id { get; set; }
        public int service_id { get; set; }
        public string? service_name { get; set; }
        public string? service_code { get; set; }
        public DateTime created_at { get; set; }
    }
}