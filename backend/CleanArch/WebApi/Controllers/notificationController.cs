using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class notificationController : ControllerBase
    {
        private readonly notificationUseCases _notificationUseCases;

        public notificationController(notificationUseCases notificationUseCases)
        {
            _notificationUseCases = notificationUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _notificationUseCases.GetAll();
            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("GetMyNotifications")]
        public async Task<IActionResult> GetMyNotifications()
        {
            try
            {
                var response = await _notificationUseCases.GetMyNotifications();
                return Ok(response);
            }
            catch (Exception ex) {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _notificationUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatenotificationRequest requestDto)
        {
            var request = new Domain.Entities.notification
            {
                
                title = requestDto.title,
                text = requestDto.text,
                employee_id = requestDto.employee_id,
                user_id = requestDto.user_id,
                has_read = requestDto.has_read,
                created_at = requestDto.created_at,
                code = requestDto.code,
                link = requestDto.link,
            };
            var response = await _notificationUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(UpdatenotificationRequest requestDto)
        {
            var request = new Domain.Entities.notification
            {
                id = requestDto.id,
                
                title = requestDto.title,
                text = requestDto.text,
                employee_id = requestDto.employee_id,
                user_id = requestDto.user_id,
                has_read = requestDto.has_read,
                created_at = requestDto.created_at,
                code = requestDto.code,
                link = requestDto.link,
            };
            var response = await _notificationUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _notificationUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _notificationUseCases.GetOne(id);
            return Ok(response);
        }


        [HttpPost]
        [Route("ClearNotification")]
        public async Task<IActionResult> ClearNotification(ClearModel id)
        {
            var response = await _notificationUseCases.ClearNotification(id.id);
            return Ok(response);
        }

        [HttpPost]
        [Route("ClearNotifications")]
        public async Task<IActionResult> ClearNotifications()
        {
            var response = await _notificationUseCases.ClearNotifications();
            return Ok(response);
        }

        public class ClearModel
        {
            public int id { get; set; }
        }
        public class ClearModelUser
        {
            public string email { get; set; }
        }

    }
}
