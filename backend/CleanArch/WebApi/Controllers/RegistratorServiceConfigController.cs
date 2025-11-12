using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegistratorServiceConfigController : ControllerBase
    {
        private readonly RegistratorServiceConfigUseCases _useCases;

        public RegistratorServiceConfigController(RegistratorServiceConfigUseCases useCases)
        {
            _useCases = useCases;
        }

        /// <summary>
        /// Получить настройки услуг текущего регистратора
        /// </summary>
        [HttpGet]
        [Route("GetMyServices")]
        public async Task<IActionResult> GetMyServices()
        {
            var result = await _useCases.GetMyServices();
            return Ok(result);
        }

        /// <summary>
        /// Получить только ID услуг текущего регистратора
        /// </summary>
        [HttpGet]
        [Route("GetMyServiceIds")]
        public async Task<IActionResult> GetMyServiceIds()
        {
            var result = await _useCases.GetMyServiceIds();
            return Ok(result);
        }

        /// <summary>
        /// Получить все настройки регистраторов (для админа)
        /// </summary>
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _useCases.GetAll();
            return Ok(result);
        }

        /// <summary>
        /// Получить настройки конкретного регистратора (для админа)
        /// </summary>
        [HttpGet]
        [Route("GetByEmployeeId")]
        public async Task<IActionResult> GetByEmployeeId(int employeeId)
        {
            var result = await _useCases.GetByEmployeeId(employeeId);
            return Ok(result);
        }

        /// <summary>
        /// Добавить услугу текущему регистратору
        /// </summary>
        [HttpPost]
        [Route("AddService")]
        public async Task<IActionResult> AddService([FromBody] AddRegistratorServiceRequest request)
        {
            var result = await _useCases.AddService(request.service_id);
            return Ok(result);
        }

        /// <summary>
        /// Удалить услугу у текущего регистратора
        /// </summary>
        [HttpDelete]
        [Route("RemoveService")]
        public async Task<IActionResult> RemoveService(int serviceId)
        {
            await _useCases.RemoveService(serviceId);
            return Ok(new { message = "Услуга успешно удалена" });
        }

        /// <summary>
        /// Обновить список услуг текущего регистратора (заменить все)
        /// </summary>
        [HttpPut]
        [Route("UpdateMyServices")]
        public async Task<IActionResult> UpdateMyServices([FromBody] UpdateRegistratorServicesRequest request)
        {
            await _useCases.UpdateMyServices(request.service_ids ?? new int[] { });
            return Ok(new { message = "Настройки успешно обновлены" });
        }

        /// <summary>
        /// Удалить настройку по ID (для админа)
        /// </summary>
        [HttpDelete]
        [Route("DeleteById")]
        public async Task<IActionResult> DeleteById(int id)
        {
            await _useCases.DeleteById(id);
            return Ok(new { message = "Настройка успешно удалена" });
        }
    }
}