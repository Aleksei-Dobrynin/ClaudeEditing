using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Iapplication_stepRepository : BaseRepository
    {
        Task<List<application_step>> GetAll();
        Task<List<UnsignedDocumentsModel>> GetUnsignedDocuments(List<int> post_ids, List<int> structure_ids, string search, bool isDeadline, string user_id);
        Task<PaginatedList<application_step>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(application_step domain);
        Task Update(application_step domain);
        Task<application_step> GetOne(int id);
        Task Delete(int id);

        /// <summary>
        /// Получить все динамически добавленные шаги для конкретной дополнительной услуги
        /// ЗАЧЕМ: Для отображения, отслеживания прогресса, отмены
        /// ПРИМЕР: Показать пользователю все 5 шагов топосъемки в заявке
        /// </summary>
        Task<List<application_step>> GetDynamicallyAddedSteps(int applicationId, int additionalServiceLinkId);

        /// <summary>
        /// Сдвинуть order_number существующих шагов вниз (освободить место для вставки)
        /// ЗАЧЕМ: Освободить место для вставки новых шагов
        /// ПРИМЕР: Если вставляем 5 шагов после шага №3, то шаги 4,5 станут 9,10
        /// КОГДА: Перед вставкой новых шагов
        /// ПАРАМЕТРЫ:
        ///   - applicationId: ID заявки
        ///   - afterOrderNumber: После какого номера вставляем
        ///   - shiftBy: На сколько позиций сдвинуть
        /// ВОЗВРАТ: Количество обновленных записей
        /// </summary>
        Task<int> ShiftOrderNumbers(int applicationId, int afterOrderNumber, int shiftBy);

        /// <summary>
        /// Перенумеровать все шаги заявки (убрать "дыры" в нумерации)
        /// ЗАЧЕМ: Убрать пропуски после удаления шагов
        /// ПРИМЕР: Было 1,2,3,8,9,10 → станет 1,2,3,4,5,6
        /// КОГДА: После отмены дополнительной услуги
        /// </summary>
        Task ReorderSteps(int applicationId);

        /// <summary>
        /// Проверить завершены ли все динамически добавленные шаги
        /// ЗАЧЕМ: Определить момент когда нужно завершить дополнительную услугу
        /// КОГДА: После завершения каждого шага
        /// ВОЗВРАТ: true если все завершены, false если есть незавершенные
        /// </summary>
        Task<bool> AreAllDynamicStepsCompleted(int additionalServiceLinkId);

        /// <summary>
        /// Проверить начаты ли какие-либо из добавленных шагов
        /// ЗАЧЕМ: Определить можно ли отменить дополнительную услугу
        /// ПРАВИЛО: Отменить можно только если ни один шаг не начат (все в pending)
        /// КОГДА: Перед отменой дополнительной услуги
        /// ВОЗВРАТ: true если хотя бы один шаг начат, false если все в pending
        /// </summary>
        Task<bool> AreAnyDynamicStepsStarted(int additionalServiceLinkId);

        /// <summary>
        /// Удалить динамически добавленные шаги
        /// ЗАЧЕМ: Очистить шаги при отмене дополнительной услуги
        /// КОГДА: При отмене, если ни один шаг не начат
        /// ВНИМАНИЕ: Перед вызовом нужно удалить связанные document_approval!
        /// </summary>
        Task DeleteDynamicSteps(int additionalServiceLinkId);


        Task<List<application_step>> GetByapplication_id(int application_id);
        Task<List<application_step>> GetBystep_id(int step_id);
        Task DeleteByApplicationId(int application_id);
    }
}
