using Application.Repositories;
using Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class RegistratorServiceConfigUseCases
    {
        private readonly IUnitOfWork _unitOfWork;

        public RegistratorServiceConfigUseCases(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Получить услуги текущего регистратора
        /// </summary>
        public async Task<IEnumerable<RegistratorServiceConfig>> GetMyServices()
        {
            var employee = await _unitOfWork.EmployeeRepository.GetUser();
            return await _unitOfWork.RegistratorServiceConfigRepository.GetByEmployeeId(employee.id);
        }

        /// <summary>
        /// Получить только ID услуг текущего регистратора
        /// </summary>
        public async Task<IEnumerable<int>> GetMyServiceIds()
        {
            var employee = await _unitOfWork.EmployeeRepository.GetUser();
            return await _unitOfWork.RegistratorServiceConfigRepository.GetServiceIdsByEmployeeId(employee.id);
        }

        /// <summary>
        /// Получить все настройки (для админа)
        /// </summary>
        public async Task<IEnumerable<RegistratorServiceConfig>> GetAll()
        {
            return await _unitOfWork.RegistratorServiceConfigRepository.GetAll();
        }

        /// <summary>
        /// Получить настройки конкретного регистратора (для админа)
        /// </summary>
        public async Task<IEnumerable<RegistratorServiceConfig>> GetByEmployeeId(int employeeId)
        {
            return await _unitOfWork.RegistratorServiceConfigRepository.GetByEmployeeId(employeeId);
        }

        /// <summary>
        /// Добавить услугу текущему регистратору
        /// </summary>
        public async Task<RegistratorServiceConfig> AddService(int serviceId)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetUser();
            var result = await _unitOfWork.RegistratorServiceConfigRepository.Add(
                employee.id,
                serviceId,
                employee.uid ?? 0
            );
            _unitOfWork.Commit();
            return result;
        }

        /// <summary>
        /// Удалить услугу у текущего регистратора
        /// </summary>
        public async Task RemoveService(int serviceId)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetUser();
            await _unitOfWork.RegistratorServiceConfigRepository.Delete(employee.id, serviceId);
            _unitOfWork.Commit();
        }

        /// <summary>
        /// Обновить список услуг текущего регистратора
        /// </summary>
        public async Task UpdateMyServices(int[] serviceIds)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetUser();
            await _unitOfWork.RegistratorServiceConfigRepository.UpdateServicesForRegistrator(
                employee.id,
                serviceIds,
                employee.uid ?? 0
            );
            _unitOfWork.Commit();
        }

        /// <summary>
        /// Удалить настройку по ID (для админа)
        /// </summary>
        public async Task DeleteById(int id)
        {
            await _unitOfWork.RegistratorServiceConfigRepository.DeleteById(id);
            _unitOfWork.Commit();
        }
    }
}