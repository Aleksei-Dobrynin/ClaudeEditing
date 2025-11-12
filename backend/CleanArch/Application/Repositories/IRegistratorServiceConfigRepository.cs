using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IRegistratorServiceConfigRepository : BaseRepository
    {
        /// <summary>
        /// Получить список ID услуг для регистратора
        /// </summary>
        Task<IEnumerable<int>> GetServiceIdsByEmployeeId(int employeeId);

        /// <summary>
        /// Получить все настройки регистратора с информацией об услугах
        /// </summary>
        Task<IEnumerable<RegistratorServiceConfig>> GetByEmployeeId(int employeeId);

        /// <summary>
        /// Получить все настройки (для админа)
        /// </summary>
        Task<IEnumerable<RegistratorServiceConfig>> GetAll();

        /// <summary>
        /// Добавить услугу для регистратора
        /// </summary>
        Task<RegistratorServiceConfig> Add(int employeeId, int serviceId, int createdBy);

        /// <summary>
        /// Удалить услугу у регистратора
        /// </summary>
        Task Delete(int employeeId, int serviceId);

        /// <summary>
        /// Удалить конкретную настройку по ID
        /// </summary>
        Task DeleteById(int id);

        /// <summary>
        /// Обновить список услуг регистратора (заменить все)
        /// </summary>
        Task UpdateServicesForRegistrator(int employeeId, int[] serviceIds, int updatedBy);

        /// <summary>
        /// Проверить существование настройки
        /// </summary>
        Task<bool> Exists(int employeeId, int serviceId);
    }
}