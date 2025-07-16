using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class task_statusController : ControllerBase
    {
        private readonly task_statusUseCases _task_statusUseCases;

        public task_statusController(task_statusUseCases task_statusUseCases)
        {
            _task_statusUseCases = task_statusUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _task_statusUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _task_statusUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createtask_statusRequest requestDto)
        {
            var request = new Domain.Entities.task_status
            {
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                textcolor = requestDto.textcolor,
                backcolor = requestDto.backcolor,
            };
            var response = await _task_statusUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatetask_statusRequest requestDto)
        {
            var request = new Domain.Entities.task_status
            {
                id = requestDto.id,
                
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                textcolor = requestDto.textcolor,
                backcolor = requestDto.backcolor,
            };
            var response = await _task_statusUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _task_statusUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _task_statusUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
