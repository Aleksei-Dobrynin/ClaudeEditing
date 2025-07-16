using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class notification_logController : ControllerBase
    {
        private readonly notification_logUseCases _notification_logUseCases;

        public notification_logController(notification_logUseCases notification_logUseCases)
        {
            _notification_logUseCases = notification_logUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _notification_logUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetUnsended")]
        public async Task<IActionResult> GetUnsended()
        {
            var response = await _notification_logUseCases.GetUnsended();
            return Ok(response);
        }

        [HttpPost]
        [AllowAnonymous] 
        [Route("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus([FromBody] List<StatusUpdates> list)
        {
            if (list == null || !list.Any())
                return BadRequest("Список обновлений пуст или не предоставлен");

            var successCount = 0;
            var errorMessages = new List<string>();

            var tasks = list.Select(async item =>
            {
                try
                {
                    await _notification_logUseCases.UpdateStatus(item.id_status, item.id);
                    Interlocked.Increment(ref successCount);
                }
                catch (Exception ex)
                {
                    errorMessages.Add($"Ошибка при обновлении ID {item.id}: {ex.Message}");
                }
            });

            await Task.WhenAll(tasks);

            var result = new
            {
                Total = list.Count,
                Success = successCount,
                Errors = errorMessages
            };

            return errorMessages.Any()
                ? (IActionResult)StatusCode(StatusCodes.Status207MultiStatus, result)
                : Ok(result);
        }

        public class StatusUpdates
        {
            public int id_status { get; set; }
            public int id { get; set; }

        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _notification_logUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createnotification_logRequest requestDto)
        {
            var request = new Domain.Entities.notification_log
            {
                
                employee_id = requestDto.employee_id,
                user_id = requestDto.user_id,
                message = requestDto.message,
                subject = requestDto.subject,
                guid = requestDto.guid,
                date_send = requestDto.date_send,
                type = requestDto.type,
                status_id = requestDto.status_id
            };
            var response = await _notification_logUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatenotification_logRequest requestDto)
        {
            var request = new Domain.Entities.notification_log
            {
                id = requestDto.id,
                
                employee_id = requestDto.employee_id,
                user_id = requestDto.user_id,
                message = requestDto.message,
                subject = requestDto.subject,
                guid = requestDto.guid,
                date_send = requestDto.date_send,
                type = requestDto.type,
                status_id = requestDto.status_id
            };
            var response = await _notification_logUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _notification_logUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _notification_logUseCases.GetOne(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByApplicationId")]
        public async Task<IActionResult> GetByApplicationId(int id)
        {
            var response = await _notification_logUseCases.GetByApplicationId(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetAppLogBySearch")]
        public async Task<IActionResult> GetAppLogBySearch(string? search, bool? showOnlyFailed, int? pageNumber, int? pageSize)
        {
            var response = await _notification_logUseCases.GetAppLogBySearch(search, showOnlyFailed, pageNumber, pageSize);
            return Ok(response);
        }

        [HttpPost]
        [Route("CreateRange")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRange(List<Domain.Entities.notification_log> models)
        {
            await _notification_logUseCases.CreateRange(models);
            return Ok();
        }

        public class NotificationLogs
        {
            public List<Domain.Entities.notification_log> logs { get; set; }
        }

    }
}
