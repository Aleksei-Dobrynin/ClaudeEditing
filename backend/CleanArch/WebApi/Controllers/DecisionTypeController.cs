using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class DecisionTypeController : ControllerBase
    {
        private readonly DecisionTypeUseCases _DecisionTypeUseCases;

        public DecisionTypeController(DecisionTypeUseCases DecisionTypeUseCases)
        {
            _DecisionTypeUseCases = DecisionTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _DecisionTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _DecisionTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _DecisionTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateDecisionTypeRequest requestDto)
        {
            var request = new Domain.Entities.DecisionType
            {
               name = requestDto.name,
               code = requestDto.code,
               description = requestDto.description
            };
            var response = await _DecisionTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateDecisionTypeRequest requestDto)
        {
            var request = new Domain.Entities.DecisionType
            {
               id = requestDto.id,
               name = requestDto.name,
               code = requestDto.code,
               description = requestDto.description
            };
            var response = await _DecisionTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _DecisionTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
