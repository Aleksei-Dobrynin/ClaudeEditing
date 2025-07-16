using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class LawDocumentController : ControllerBase
    {
        private readonly LawDocumentUseCases _LawDocumentUseCases;

        public LawDocumentController(LawDocumentUseCases LawDocumentUseCases)
        {
            _LawDocumentUseCases = LawDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _LawDocumentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _LawDocumentUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _LawDocumentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateLawDocumentRequest requestDto)
        {
            var request = new Domain.Entities.LawDocument
            {
               name = requestDto.name,
               data = requestDto.data,
               description = requestDto.description,
               type_id = requestDto.type_id,
               link = requestDto.link,
               name_kg = requestDto.name_kg,
               description_kg = requestDto.description_kg
            };
            var response = await _LawDocumentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateLawDocumentRequest requestDto)
        {
            var request = new Domain.Entities.LawDocument
            {
               id = requestDto.id,
               name = requestDto.name,
               data = requestDto.data,
               description = requestDto.description,
               type_id = requestDto.type_id,
               link = requestDto.link,
               name_kg = requestDto.name_kg,
               description_kg = requestDto.description_kg,
            };
            var response = await _LawDocumentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _LawDocumentUseCases.Delete(id);
            return Ok();
        }
    }
}
