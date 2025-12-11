using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    /// <summary>
    /// Интерфейс репозитория для работы с дополнительными услугами
    /// </summary>
    public interface Iapplication_additional_serviceRepository : BaseRepository
    {
        /// <summary>
        /// Получить все записи о дополнительных услугах
        /// </summary>
        Task<List<application_additional_service>> GetAll();

        /// <summary>
        /// Получить одну запись по ID
        /// </summary>
        Task<application_additional_service> GetOne(int id);

        /// <summary>
        /// Добавить новую запись о дополнительной услуге
        /// </summary>
        Task<int> Add(application_additional_service domain);

        /// <summary>
        /// Обновить запись о дополнительной услуге
        /// </summary>
        Task Update(application_additional_service domain);

        /// <summary>
        /// Удалить запись о дополнительной услуге
        /// </summary>
        Task Delete(int id);

        /// <summary>
        /// Получить все дополнительные услуги для конкретной заявки
        /// КОГДА: Для отображения в интерфейсе заявки
        /// ЗАЧЕМ: Показать список всех добавленных услуг с их статусами
        /// </summary>
        Task<List<application_additional_service>> GetByApplicationId(int applicationId);

        /// <summary>
        /// Проверить, добавлена ли уже эта услуга (service_path) в заявку
        /// КОГДА: Перед добавлением новых шагов
        /// ЗАЧЕМ: Не дать добавить одну услугу дважды (бизнес-правило)
        /// ВОЗВРАТ: Запись если услуга уже добавлена, null если нет
        /// </summary>
        Task<application_additional_service> GetActiveByServicePathId(int applicationId, int servicePathId);

        /// <summary>
        /// Подсчитать количество активных дополнительных услуг в заявке
        /// КОГДА: Перед добавлением новой услуги
        /// ЗАЧЕМ: Проверить лимит (максимум 3 дополнительные услуги)
        /// ВОЗВРАТ: Количество услуг со статусом pending или active
        /// </summary>
        Task<int> GetActiveServicesCount(int applicationId);

        /// <summary>
        /// Завершить дополнительную услугу (установить статус completed)
        /// КОГДА: Когда все добавленные шаги завершены
        /// ЗАЧЕМ: Автоматически завершить услугу
        /// </summary>
        Task CompleteService(int id);

        /// <summary>
        /// Отменить дополнительную услугу (установить статус cancelled)
        /// КОГДА: Пользователь передумал или ошибся
        /// ЗАЧЕМ: Пометить услугу как отмененную (шаги должны быть удалены отдельно)
        /// </summary>
        Task CancelService(int id);
    }
}