using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class StepRequiredCalcController : ControllerBase
    {
        private readonly StepRequiredCalcUseCases _StepRequiredCalcUseCases;

        public StepRequiredCalcController(StepRequiredCalcUseCases StepRequiredCalcUseCases)
        {
            _StepRequiredCalcUseCases = StepRequiredCalcUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _StepRequiredCalcUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _StepRequiredCalcUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StepRequiredCalcUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStepRequiredCalcRequest requestDto)
        {
            var request = new Domain.Entities.StepRequiredCalc
            {
               step_id = requestDto.step_id,
               structure_id = requestDto.structure_id,

            };
            var response = await _StepRequiredCalcUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateStepRequiredCalcRequest requestDto)
        {
            var request = new Domain.Entities.StepRequiredCalc
            {
               id = requestDto.id,
               step_id = requestDto.step_id,
               structure_id = requestDto.structure_id,

            };
            var response = await _StepRequiredCalcUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _StepRequiredCalcUseCases.Delete(id);
            return Ok();
        }
    }
}
