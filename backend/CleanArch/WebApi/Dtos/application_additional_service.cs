using System.ComponentModel.DataAnnotations;

namespace WebApi.Dtos
{
    /// <summary>
    /// DTO для запроса добавления шагов из другой услуги
    /// </summary>
    public class AddStepsRequest
    {
        /// <summary>
        /// ID заявки, в которую добавляем шаги
        /// </summary>
        [Required(ErrorMessage = "application_id обязателен")]
        public int application_id { get; set; }

        /// <summary>
        /// ID service_path, откуда берем шаги
        /// </summary>
        [Required(ErrorMessage = "additional_service_path_id обязателен")]
        public int additional_service_path_id { get; set; }

        /// <summary>
        /// ID шага, на котором поняли что нужны доп. работы
        /// </summary>
        [Required(ErrorMessage = "added_at_step_id обязателен")]
        public int added_at_step_id { get; set; }

        /// <summary>
        /// ID шага, после которого вставить новые шаги
        /// </summary>
        [Required(ErrorMessage = "insert_after_step_id обязателен")]
        public int insert_after_step_id { get; set; }

        /// <summary>
        /// Обоснование зачем добавляем (минимум 10 символов)
        /// </summary>
        [Required(ErrorMessage = "add_reason обязателен")]
        [MinLength(10, ErrorMessage = "Причина должна быть не менее 10 символов")]
        public string add_reason { get; set; }
    }

    /// <summary>
    /// DTO для отмены дополнительной услуги
    /// </summary>
    public class CancelAdditionalServiceRequest
    {
        /// <summary>
        /// ID записи в application_additional_service
        /// </summary>
        [Required(ErrorMessage = "id обязателен")]
        public int id { get; set; }
    }
}