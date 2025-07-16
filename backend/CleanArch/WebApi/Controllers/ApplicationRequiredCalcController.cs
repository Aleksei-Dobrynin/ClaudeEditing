using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class ApplicationRequiredCalcController : ControllerBase
    {
        private readonly ApplicationRequiredCalcUseCases _ApplicationRequiredCalcUseCases;

        public ApplicationRequiredCalcController(ApplicationRequiredCalcUseCases ApplicationRequiredCalcUseCases)
        {
            _ApplicationRequiredCalcUseCases = ApplicationRequiredCalcUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationRequiredCalcUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _ApplicationRequiredCalcUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _ApplicationRequiredCalcUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        // [HttpPost]
        // [Route("Create")]
        // public async Task<IActionResult> Create(CreateApplicationRequiredCalcRequest requestDto)
        // {
        //     var request = new Domain.Entities.ApplicationRequiredCalc
        //     {
        //        application_id = requestDto.application_id,
        //        application_step_id = requestDto.application_step_id,
        //        structure_id = requestDto.structure_id,
        //
        //     };
        //     var response = await _ApplicationRequiredCalcUseCases.Create(request);
        //     return Ok(response);
        // }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateApplicationRequiredCalcRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationRequiredCalc
            {
               id = requestDto.id,
               application_id = requestDto.application_id,
               application_step_id = requestDto.application_step_id,
               structure_id = requestDto.structure_id,

            };
            var response = await _ApplicationRequiredCalcUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ApplicationRequiredCalcUseCases.Delete(id);
            return Ok();
        }
    }
}
