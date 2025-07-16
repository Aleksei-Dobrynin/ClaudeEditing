using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_pauseController : ControllerBase
    {
        private readonly application_pauseUseCases _application_pauseUseCases;

        public application_pauseController(application_pauseUseCases application_pauseUseCases)
        {
            _application_pauseUseCases = application_pauseUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_pauseUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_pauseUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_pauseRequest requestDto)
        {
            var request = new Domain.Entities.application_pause
            {
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                app_step_id = requestDto.app_step_id,
                pause_reason = requestDto.pause_reason,
                pause_start = requestDto.pause_start,
                pause_end = requestDto.pause_end,
                comments = requestDto.comments,
                is_excluded_from_sla = requestDto.is_excluded_from_sla,
                created_at = requestDto.created_at,
            };
            var response = await _application_pauseUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_pauseRequest requestDto)
        {
            var request = new Domain.Entities.application_pause
            {
                id = requestDto.id,
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                app_step_id = requestDto.app_step_id,
                pause_reason = requestDto.pause_reason,
                pause_start = requestDto.pause_start,
                pause_end = requestDto.pause_end,
                comments = requestDto.comments,
                is_excluded_from_sla = requestDto.is_excluded_from_sla,
                created_at = requestDto.created_at,
            };
            var response = await _application_pauseUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_pauseUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_pauseUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_pauseUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByapp_step_id")]
        public async Task<IActionResult> GetByapp_step_id(int app_step_id)
        {
            var response = await _application_pauseUseCases.GetByapp_step_id(app_step_id);
            return Ok(response);
        }
        

    }
}
