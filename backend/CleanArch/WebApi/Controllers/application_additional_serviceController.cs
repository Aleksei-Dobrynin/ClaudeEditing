using Microsoft.AspNetCore.Mvc;
using Application.UseCases;
using WebApi.Dtos;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_additional_serviceController : ControllerBase
    {
        private readonly application_additional_serviceUseCases _useCases;

        public application_additional_serviceController(application_additional_serviceUseCases useCases)
        {
            _useCases = useCases;
        }

        /// <summary>
        /// Добавить шаги из другой услуги в заявку
        /// </summary>
        /// <remarks>
        /// Пример запроса:
        /// 
        ///     POST /application_additional_service/AddSteps
        ///     {
        ///        "application_id": 12345,
        ///        "additional_service_path_id": 42,
        ///        "added_at_step_id": 103,
        ///        "insert_after_step_id": 103,
        ///        "add_reason": "Для проведения экспертизы фасада необходимы данные топосъемки"
        ///     }
        /// 
        /// </remarks>
        [HttpPost]
        [Route("AddSteps")]
        public async Task<IActionResult> AddSteps([FromBody] AddStepsRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _useCases.AddStepsFromService(
                request.application_id,
                request.additional_service_path_id,
                request.added_at_step_id,
                request.insert_after_step_id,
                request.add_reason
            );

            if (result.IsFailed)
                return BadRequest(new { error = result.Errors[0].Message });

            return Ok(result.Value);
        }

        /// <summary>
        /// Получить все дополнительные услуги для заявки
        /// </summary>
        /// <remarks>
        /// Пример запроса:
        /// 
        ///     GET /application_additional_service/GetByApplicationId?application_id=12345
        /// 
        /// </remarks>
        [HttpGet]
        [Route("GetByApplicationId")]
        public async Task<IActionResult> GetByApplicationId([FromQuery] int application_id)
        {
            try
            {
                var services = await _useCases.GetByApplicationId(application_id);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Получить одну дополнительную услугу по ID
        /// </summary>
        /// <remarks>
        /// Пример запроса:
        /// 
        ///     GET /application_additional_service/GetOne?id=5
        /// 
        /// </remarks>
        [HttpGet]
        [Route("GetOne")]
        public async Task<IActionResult> GetOne([FromQuery] int id)
        {
            try
            {
                var service = await _useCases.GetOne(id);

                if (service == null)
                    return NotFound(new { error = "Дополнительная услуга не найдена" });

                return Ok(service);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Отменить дополнительную услугу
        /// </summary>
        /// <remarks>
        /// Пример запроса:
        /// 
        ///     POST /application_additional_service/Cancel
        ///     {
        ///        "id": 5
        ///     }
        /// 
        /// ВНИМАНИЕ: Можно отменить только если ни один шаг не начат (все в статусе pending)
        /// </remarks>
        [HttpPost]
        [Route("Cancel")]
        public async Task<IActionResult> Cancel([FromBody] CancelAdditionalServiceRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _useCases.CancelAdditionalService(request.id);

            if (result.IsFailed)
                return BadRequest(new { error = result.Errors[0].Message });

            return Ok(new { message = "Дополнительная услуга отменена" });
        }
    }
}