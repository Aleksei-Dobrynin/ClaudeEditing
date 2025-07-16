using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class LawDocumentTypeController : ControllerBase
    {
        private readonly LawDocumentTypeUseCases _LawDocumentTypeUseCases;

        public LawDocumentTypeController(LawDocumentTypeUseCases LawDocumentTypeUseCases)
        {
            _LawDocumentTypeUseCases = LawDocumentTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _LawDocumentTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _LawDocumentTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _LawDocumentTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateLawDocumentTypeRequest requestDto)
        {
            var request = new Domain.Entities.LawDocumentType
            {
               name = requestDto.name,
               description = requestDto.description,
               code = requestDto.code,
               name_kg = requestDto.name_kg,
               description_kg = requestDto.description_kg,
            };
            var response = await _LawDocumentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateLawDocumentTypeRequest requestDto)
        {
            var request = new Domain.Entities.LawDocumentType
            {
               id = requestDto.id,
               name = requestDto.name,
               description = requestDto.description,
               code = requestDto.code,
               name_kg = requestDto.name_kg,
               description_kg = requestDto.description_kg,
            };
            var response = await _LawDocumentTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _LawDocumentTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
