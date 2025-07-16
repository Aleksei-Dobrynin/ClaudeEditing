using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class path_stepController : ControllerBase
    {
        private readonly path_stepUseCases _path_stepUseCases;

        public path_stepController(path_stepUseCases path_stepUseCases)
        {
            _path_stepUseCases = path_stepUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _path_stepUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _path_stepUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createpath_stepRequest requestDto)
        {
            var request = new Domain.Entities.path_step
            {
                
                step_type = requestDto.step_type,
                path_id = requestDto.path_id,
                responsible_org_id = requestDto.responsible_org_id,
                name = requestDto.name,
                description = requestDto.description,
                order_number = requestDto.order_number,
                is_required = requestDto.is_required,
                estimated_days = requestDto.estimated_days,
                wait_for_previous_steps = requestDto.wait_for_previous_steps,
            };
            var response = await _path_stepUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatepath_stepRequest requestDto)
        {
            var request = new Domain.Entities.path_step
            {
                id = requestDto.id,
                
                step_type = requestDto.step_type,
                path_id = requestDto.path_id,
                responsible_org_id = requestDto.responsible_org_id,
                name = requestDto.name,
                description = requestDto.description,
                order_number = requestDto.order_number,
                is_required = requestDto.is_required,
                estimated_days = requestDto.estimated_days,
                wait_for_previous_steps = requestDto.wait_for_previous_steps,
            };
            var response = await _path_stepUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _path_stepUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _path_stepUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBypath_id")]
        public async Task<IActionResult> GetBypath_id(int path_id)
        {
            var response = await _path_stepUseCases.GetBypath_id(path_id);
            return Ok(response);
        }
        

    }
}
