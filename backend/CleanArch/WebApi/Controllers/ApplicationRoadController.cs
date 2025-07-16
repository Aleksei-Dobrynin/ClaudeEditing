using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Exceptions;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationRoadController : ControllerBase
    {
        private readonly ApplicationRoadUseCases _applicationDocumentTypeUseCases;

        public ApplicationRoadController(ApplicationRoadUseCases applicationDocumentTypeUseCases)
        {
            _applicationDocumentTypeUseCases = applicationDocumentTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _applicationDocumentTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _applicationDocumentTypeUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateApplicationRoadRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationRoad
            {
                from_status_id = requestDto.from_status_id,
                to_status_id = requestDto.to_status_id,
                rule_expression = requestDto.rule_expression,
                description = requestDto.description,
                validation_url = requestDto.validation_url,
                post_function_url = requestDto.post_function_url,
                is_active = requestDto.is_active,
                posts = requestDto.posts,
                group_id = requestDto.group_id
            };
            var response = await _applicationDocumentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationRoadRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationRoad
            {
                id = requestDto.id,
                from_status_id = requestDto.from_status_id,
                to_status_id = requestDto.to_status_id,
                rule_expression = requestDto.rule_expression,
                description = requestDto.description,
                validation_url = requestDto.validation_url,
                post_function_url = requestDto.post_function_url,
                is_active = requestDto.is_active,
                posts = requestDto.posts,
                group_id = requestDto.group_id
            };
            var response = await _applicationDocumentTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _applicationDocumentTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
