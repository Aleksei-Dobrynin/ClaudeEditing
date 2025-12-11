using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface Ipath_stepRepository : BaseRepository
    {
        Task<List<path_step>> GetAll();
        Task<PaginatedList<path_step>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(path_step domain);
        Task Update(path_step domain);
        Task<path_step> GetOne(int id);
        Task Delete(int id);

        /// <summary>
        /// Получить все шаги для конкретного service_path
        /// ЗАЧЕМ: Узнать какие шаги нужно скопировать из услуги-источника
        /// ПРИМЕР: Получить все шаги топосъемки чтобы добавить их в заявку
        /// КОГДА: При добавлении шагов из другой услуги
        /// ВОЗВРАТ: Список path_step упорядоченный по order_number
        /// </summary>
        Task<List<path_step>> GetByServicePathId(int servicePathId);

        Task<List<path_step>> GetBypath_id(int path_id);
    }
}
