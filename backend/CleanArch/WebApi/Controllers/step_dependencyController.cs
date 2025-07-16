using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class step_dependencyController : ControllerBase
    {
        private readonly step_dependencyUseCases _step_dependencyUseCases;

        public step_dependencyController(step_dependencyUseCases step_dependencyUseCases)
        {
            _step_dependencyUseCases = step_dependencyUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _step_dependencyUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _step_dependencyUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetByFilter")]
        public async Task<IActionResult> GetByFilter(FilterStepDependencyRequest filter)
        {
            var response = await _step_dependencyUseCases.GetByFilter(filter.service_path_id);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstep_dependencyRequest requestDto)
        {
            var request = new Domain.Entities.step_dependency
            {

                dependent_step_id = requestDto.dependent_step_id,
                prerequisite_step_id = requestDto.prerequisite_step_id,
                is_strict = requestDto.is_strict,
                updated_by = requestDto.updated_by,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by
            };
            var response = await _step_dependencyUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestep_dependencyRequest requestDto)
        {
            var request = new Domain.Entities.step_dependency
            {
                id = requestDto.id,

                dependent_step_id = requestDto.dependent_step_id,
                prerequisite_step_id = requestDto.prerequisite_step_id,
                is_strict = requestDto.is_strict,
                created_at = requestDto.created_at,
                created_by = requestDto.created_by,
                updated_at = requestDto.updated_at,
                updated_by = requestDto.updated_by
            };
            var response = await _step_dependencyUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _step_dependencyUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _step_dependencyUseCases.GetOne(id);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetBydependent_step_id")]
        public async Task<IActionResult> GetBydependent_step_id(int dependent_step_id)
        {
            var response = await _step_dependencyUseCases.GetBydependent_step_id(dependent_step_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByprerequisite_step_id")]
        public async Task<IActionResult> GetByprerequisite_step_id(int prerequisite_step_id)
        {
            var response = await _step_dependencyUseCases.GetByprerequisite_step_id(prerequisite_step_id);
            return Ok(response);
        }


    }
}