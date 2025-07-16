using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HrmsEventTypeController : ControllerBase
    {
        private readonly HrmsEventTypeUseCases _applicationDocumentTypeUseCases;

        public HrmsEventTypeController(HrmsEventTypeUseCases applicationDocumentTypeUseCases)
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

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _applicationDocumentTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateHrmsEventTypeRequest requestDto)
        {
            var request = new Domain.Entities.HrmsEventType
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _applicationDocumentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateHrmsEventTypeRequest requestDto)
        {
            var request = new Domain.Entities.HrmsEventType
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
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
