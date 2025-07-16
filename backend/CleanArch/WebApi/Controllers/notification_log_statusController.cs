using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class notification_log_statusController : ControllerBase
    {
        private readonly notification_log_statusUseCases _notification_log_statusUseCases;

        public notification_log_statusController(notification_log_statusUseCases notification_log_statusUseCases)
        {
            _notification_log_statusUseCases = notification_log_statusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _notification_log_statusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _notification_log_statusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createnotification_log_statusRequest requestDto)
        {
            var request = new Domain.Entities.notification_log_status
            {
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                created_at = requestDto.created_at,
            };
            var response = await _notification_log_statusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatenotification_log_statusRequest requestDto)
        {
            var request = new Domain.Entities.notification_log_status
            {
                id = requestDto.id,
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                created_at = requestDto.created_at,
            };
            var response = await _notification_log_statusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _notification_log_statusUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _notification_log_statusUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
