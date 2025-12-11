using System;

namespace Domain.Entities
{
    /// <summary>
    /// Представляет добавленную дополнительную услугу в заявку.
    /// Хранит информацию о динамически добавленных шагах из других услуг.
    /// </summary>
    public class application_additional_service
    {
        public int id { get; set; }

        // ========== СВЯЗИ ==========

        /// <summary>
        /// ID заявки, в которую добавлены шаги
        /// </summary>
        public int? application_id { get; set; }

        /// <summary>
        /// ID service_path, откуда взяты шаги
        /// </summary>
        public int? additional_service_path_id { get; set; }

        // ========== КОНТЕКСТ ДОБАВЛЕНИЯ ==========

        /// <summary>
        /// ID шага, на котором поняли что нужны дополнительные работы
        /// </summary>
        public int? added_at_step_id { get; set; }

        /// <summary>
        /// После какого order_number вставлены новые шаги
        /// </summary>
        public int? insert_after_step_order { get; set; }

        /// <summary>
        /// Обоснование зачем добавляем (обязательное поле)
        /// </summary>
        public string add_reason { get; set; }

        /// <summary>
        /// ID сотрудника, который запросил добавление
        /// </summary>
        public int? requested_by { get; set; }

        /// <summary>
        /// Когда запросили добавление
        /// </summary>
        public DateTime? requested_at { get; set; }

        // ========== СТАТУС ==========

        /// <summary>
        /// Статус выполнения добавленных шагов
        /// pending = добавлены, но еще не начали
        /// active = выполняются
        /// completed = все завершены
        /// cancelled = отменены
        /// </summary>
        public string status { get; set; }

        // ========== ССЫЛКИ НА ДОБАВЛЕННЫЕ ШАГИ ==========

        /// <summary>
        /// ID первого добавленного application_step (для быстрого доступа)
        /// </summary>
        public int? first_added_step_id { get; set; }

        /// <summary>
        /// ID последнего добавленного application_step (для быстрого доступа)
        /// </summary>
        public int? last_added_step_id { get; set; }

        // ========== ЗАВЕРШЕНИЕ ==========

        /// <summary>
        /// Когда завершены все добавленные шаги
        /// </summary>
        public DateTime? completed_at { get; set; }

        // ========== АУДИТ ==========

        public DateTime? created_at { get; set; }
        public int? created_by { get; set; }
        public DateTime? updated_at { get; set; }
        public int? updated_by { get; set; }

        // ========== НАВИГАЦИОННЫЕ СВОЙСТВА (для удобства) ==========

        /// <summary>
        /// Название service_path (заполняется при JOIN)
        /// </summary>
        public string service_path_name { get; set; }

        /// <summary>
        /// Название сервиса (заполняется при JOIN)
        /// </summary>
        public string service_name { get; set; }

        /// <summary>
        /// ФИО запросившего (заполняется при JOIN)
        /// </summary>
        public string requested_by_name { get; set; }

        /// <summary>
        /// Название шага, на котором добавили (заполняется при JOIN)
        /// </summary>
        public string added_at_step_name { get; set; }
    }
}