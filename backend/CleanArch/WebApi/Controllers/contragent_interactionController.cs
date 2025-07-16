using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class contragent_interactionController : ControllerBase
    {
        private readonly contragent_interactionUseCases _contragent_interactionUseCases;

        public contragent_interactionController(contragent_interactionUseCases contragent_interactionUseCases)
        {
            _contragent_interactionUseCases = contragent_interactionUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _contragent_interactionUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _contragent_interactionUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetFilter")]
        public async Task<IActionResult> GetFilter(string? pin, string? address, string? number, DateTime? date_start, DateTime? date_end)
        {
            var response = await _contragent_interactionUseCases.GetFilter(pin, address, number, date_start, date_end);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createcontragent_interactionRequest requestDto)
        {
            var request = new Domain.Entities.contragent_interaction
            {
                
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                task_id = requestDto.task_id,
                contragent_id = requestDto.contragent_id,
                description = requestDto.description,
                progress = requestDto.progress,
                name = requestDto.name,
                status = requestDto.status,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
            };
            var response = await _contragent_interactionUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatecontragent_interactionRequest requestDto)
        {
            var request = new Domain.Entities.contragent_interaction
            {
                id = requestDto.id,
                
                updated_by = requestDto.updated_by,
                application_id = requestDto.application_id,
                task_id = requestDto.task_id,
                contragent_id = requestDto.contragent_id,
                description = requestDto.description,
                progress = requestDto.progress,
                name = requestDto.name,
                status = requestDto.status,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
            };
            var response = await _contragent_interactionUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _contragent_interactionUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _contragent_interactionUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _contragent_interactionUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBytask_id")]
        public async Task<IActionResult> GetBytask_id(int task_id)
        {
            var response = await _contragent_interactionUseCases.GetBytask_id(task_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBycontragent_id")]
        public async Task<IActionResult> GetBycontragent_id(int contragent_id)
        {
            var response = await _contragent_interactionUseCases.GetBycontragent_id(contragent_id);
            return Ok(response);
        }
        

    }
}
