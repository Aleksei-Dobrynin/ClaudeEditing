using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class task_typeController : ControllerBase
    {
        private readonly task_typeUseCases _task_typeUseCases;

        public task_typeController(task_typeUseCases task_typeUseCases)
        {
            _task_typeUseCases = task_typeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _task_typeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _task_typeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createtask_typeRequest requestDto)
        {
            var request = new Domain.Entities.task_type
            {
                
                name = requestDto.name,
                code = requestDto.code,
                description = requestDto.description,
                is_for_task = requestDto.is_for_task,
                is_for_subtask = requestDto.is_for_subtask,
                icon_color = requestDto.icon_color,
                svg_icon_id = requestDto.svg_icon_id,
            };
            var response = await _task_typeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatetask_typeRequest requestDto)
        {
            var request = new Domain.Entities.task_type
            {
                id = requestDto.id,
                
                name = requestDto.name,
                code = requestDto.code,
                description = requestDto.description,
                is_for_task = requestDto.is_for_task,
                is_for_subtask = requestDto.is_for_subtask,
                icon_color = requestDto.icon_color,
                svg_icon_id = requestDto.svg_icon_id,
            };
            var response = await _task_typeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _task_typeUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _task_typeUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
